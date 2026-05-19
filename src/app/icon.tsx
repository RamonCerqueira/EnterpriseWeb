import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* We use solid colors for the icon to ensure maximum compatibility in all browsers */}
        {/* Outer Blue Arc (Left & Bottom) */}
        <path
          d="M 50 5 C 10 5, 5 45, 20 75 C 35 95, 75 95, 90 75 C 75 85, 40 85, 25 60 C 15 40, 25 15, 50 5 Z"
          fill="#2563eb"
        />
        
        {/* Outer Blue Arc (Top Right to Right) */}
        <path
          d="M 90 75 C 95 60, 95 30, 80 15 C 90 30, 95 50, 90 75 Z"
          fill="#1e3a8a"
        />

        {/* Green Stripe 1 (Bottom) */}
        <path
          d="M 30 70 C 50 85, 80 65, 88 45 C 70 65, 45 72, 30 70 Z"
          fill="#10b981"
        />
        
        {/* Green Stripe 2 (Middle) */}
        <path
          d="M 22 55 C 45 75, 85 50, 93 25 C 70 50, 42 58, 22 55 Z"
          fill="#34d399"
        />

        {/* Green Stripe 3 (Top) */}
        <path
          d="M 25 35 C 45 55, 80 30, 85 10 C 65 30, 42 40, 25 35 Z"
          fill="#047857"
        />
      </svg>
    ),
    { ...size }
  )
}
