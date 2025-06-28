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
              width: '100px',
              height: '100px',
              borderRadius: '20px',
              marginBottom: '32px',
              objectFit: 'contain',
            }}
          />
          
          {/* Main title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              letterSpacing: '-0.02em',
            }}
          >
            Mayura
          </h1>
          
          {/* Subtitle */}
          <p
            style={{
              fontSize: '28px',
              color: '#E5E7EB',
              margin: '0 0 24px 0',
              maxWidth: '700px',
              lineHeight: '1.2',
            }}
          >
            A Mixture of Models
          </p>
          
          {/* Key features */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '40px',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9CA3AF',
                fontSize: '18px',
              }}
            >
              🤖 Auto-Routing
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9CA3AF',
                fontSize: '18px',
              }}
            >
              ⚡ Best Results
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                color: '#9CA3AF',
                fontSize: '18px',
              }}
            >
              🆓 Free Tier
            </div>
          </div>
          
          {/* Twitter handle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '32px',
              fontSize: '16px',
              color: '#6B7280',
            }}
          >
            @MayuraAI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 