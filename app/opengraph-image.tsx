import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Mayura - A Mixture of Models'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  // Fetch the logo from public directory
  const logoUrl = new URL('/logo_192.png', 'https://mayura.rocks').toString()
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F0F0F',
          backgroundImage: 'radial-gradient(circle at 25% 25%, #9B59B6 0%, transparent 50%), radial-gradient(circle at 75% 75%, #6B46C1 0%, transparent 50%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          {/* Actual Mayura Logo */}
          <img
            src={logoUrl}
            alt="Mayura Logo"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '24px',
              marginBottom: '40px',
              objectFit: 'contain',
            }}
          />
          
          {/* Main title */}
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 24px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Mayura
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '32px',
              color: '#E5E7EB',
              margin: '0 0 32px 0',
              maxWidth: '800px',
              lineHeight: '1.2',
            }}
          >
            A Mixture of Models
          </p>
          
          {/* Description */}
          <p
            style={{
              fontSize: '24px',
              color: '#9CA3AF',
              margin: '0',
              maxWidth: '900px',
              lineHeight: '1.4',
            }}
          >
            Access GPT-4, Claude, Gemini & more automatically. 
            One prompt, perfect results.
          </p>
          
          {/* Beta badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '32px',
              backgroundColor: 'rgba(155, 89, 182, 0.2)',
              border: '2px solid #9B59B6',
              borderRadius: '12px',
              padding: '8px 16px',
              fontSize: '18px',
              color: '#E5E7EB',
            }}
          >
            🚀 Currently in Beta
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 