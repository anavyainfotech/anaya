export default function AnayaLogo({ className = "w-5 h-5", color = "#0ca656" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      fill={color}
    >
      {/* 8 Elliptical Radiating Spark Petals forming a circular star icon */}
      <ellipse cx="50" cy="18" rx="6" ry="14" />
      <ellipse cx="50" cy="82" rx="6" ry="14" />
      <ellipse cx="18" cy="50" rx="14" ry="6" />
      <ellipse cx="82" cy="50" rx="14" ry="6" />
      
      {/* Diagonal 45-degree rays */}
      <ellipse cx="27" cy="27" rx="6" ry="12" transform="rotate(-45 27 27)" />
      <ellipse cx="73" cy="27" rx="6" ry="12" transform="rotate(45 73 27)" />
      <ellipse cx="27" cy="73" rx="6" ry="12" transform="rotate(45 27 73)" />
      <ellipse cx="73" cy="73" rx="6" ry="12" transform="rotate(-45 73 73)" />

      {/* Center Radiant Core */}
      <circle cx="50" cy="50" r="11" />
    </svg>
  );
}
