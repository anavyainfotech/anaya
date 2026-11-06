import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from crawl4ai import AsyncWebCrawler
import uvicorn
from urllib.parse import urlparse
import io
import pypdf

app = FastAPI(title="Anaya Crawl4AI Engine & Doc Parser")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CrawlRequest(BaseModel):
    url: str
    max_pages: int = 6

@app.get("/health")
def health():
    return {"status": "ok", "service": "crawl4ai & doc_parser"}

@app.post("/parse-pdf")
async def parse_pdf(file: UploadFile = File(...)):
    try:
        content = await file.read()
        reader = pypdf.PdfReader(io.BytesIO(content))
        extracted_text = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text()
            if text:
                extracted_text.append(f"--- Page {i + 1} ---\n{text}")
        full_text = "\n\n".join(extracted_text)
        return {
            "success": True,
            "filename": file.filename,
            "pages_count": len(reader.pages),
            "char_count": len(full_text),
            "text": full_text[:20000] # Safe limit
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF extraction failed: {str(e)}")

@app.post("/crawl")
async def crawl_site(req: CrawlRequest):
    raw_url = req.url.strip()
    if not raw_url.startswith("http://") and not raw_url.startswith("https://"):
        raw_url = "https://" + raw_url
    
    parsed = urlparse(raw_url)
    domain_root = f"{parsed.scheme}://{parsed.netloc}"

    visited_pages = []
    
    async with AsyncWebCrawler(verbose=False) as crawler:
        # 1. Crawl Main Landing page
        main_res = await crawler.arun(url=raw_url)
        if not main_res.success:
            raise HTTPException(status_code=400, detail="Failed to reach target website")

        main_title = (main_res.metadata or {}).get("title") or parsed.netloc
        visited_pages.append({
            "url": raw_url,
            "title": main_title,
            "markdown": main_res.markdown[:4000], # AI Cleaned text
            "char_count": len(main_res.markdown or ""),
            "status": "success"
        })

        # 2. Extract internal links
        internal_links = []
        if main_res.links and "internal" in main_res.links:
            for l in main_res.links["internal"]:
                href = l.get("href")
                if href and href.startswith(domain_root) and href != raw_url and href not in internal_links:
                    internal_links.append(href)

        # 3. Crawl sub-pages up to max_pages
        target_subpages = internal_links[:req.max_pages - 1]
        for sub_url in target_subpages:
            try:
                sub_res = await crawler.arun(url=sub_url)
                if sub_res.success:
                    sub_title = (sub_res.metadata or {}).get("title") or sub_url
                    visited_pages.append({
                        "url": sub_url,
                        "title": sub_title,
                        "markdown": sub_res.markdown[:4000],
                        "char_count": len(sub_res.markdown or ""),
                        "status": "success"
                    })
            except Exception as e:
                continue

    return {
        "success": True,
        "domain": parsed.netloc,
        "total_crawled": len(visited_pages),
        "pages": visited_pages
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)
