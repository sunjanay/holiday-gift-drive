export default function ChristmasTree() {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Christmas tree with gift ornaments"
    >
      {/* Tree Trunk */}
      <rect
        x="170"
        y="420"
        width="60"
        height="80"
        fill="#8B4513"
        rx="4"
      />

      {/* Bottom Tree Section */}
      <path
        d="M 200 420 L 80 420 L 140 340 L 100 340 L 200 220 L 300 340 L 260 340 L 320 420 Z"
        fill="#2D5016"
      />

      {/* Middle Tree Section */}
      <path
        d="M 200 220 L 100 300 L 130 300 L 80 360 L 320 360 L 270 300 L 300 300 Z"
        fill="#3A6B1F"
      />

      {/* Top Tree Section */}
      <path
        d="M 200 80 L 120 220 L 150 220 L 110 280 L 290 280 L 250 220 L 280 220 Z"
        fill="#4A8028"
      />

      {/* Tree Star */}
      <path
        d="M 200 20 L 208 50 L 238 50 L 214 68 L 222 98 L 200 80 L 178 98 L 186 68 L 162 50 L 192 50 Z"
        fill="#FACA2C"
        stroke="#FA8526"
        strokeWidth="2"
      />
    </svg>
  );
}
