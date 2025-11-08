import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 ResumeWise</h1>
      <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>AI-Powered Resume Enhancement</p>
      
      <div style={{
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)'
      }}>
        <p style={{ marginBottom: '1rem' }}>Deployment successful! 🎉</p>
        <p style={{ marginBottom: '1rem' }}>Click count: {count}</p>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '12px 24px',
            fontSize: '1rem',
            background: 'white',
            color: '#667eea',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Click Me!
        </button>
      </div>
      
      <p style={{ marginTop: '2rem', opacity: 0.8 }}>Firebase & React are ready to use</p>
    </div>
  )
}

export default App
