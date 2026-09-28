import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

export default function App() {
  // Load saved URL from localStorage or start empty
  const [url, setUrl] = useState(() => localStorage.getItem('qr_url') || '')
  const [darkColor, setDarkColor] = useState('#e06d53')
  const [lightColor, setLightColor] = useState('#121214')
  const [size, setSize] = useState('320')
  const [logoUrl, setLogoUrl] = useState(null)
  const [qrDataUri, setQrDataUri] = useState('')

  const canvasRef = useRef(null)

  const generate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Clear preview if input is empty
    if (!url.trim()) {
      setQrDataUri('')
      return
    }

    const s = parseInt(size, 10)

    QRCode.toCanvas(
      canvas,
      url,
      {
        width: s,
        margin: 2,
        color: { dark: darkColor, light: lightColor },
      },
      (err) => {
        if (err) return console.error(err)

        if (logoUrl) {
          const ctx = canvas.getContext('2d')
          const img = new Image()
          img.crossOrigin = 'Anonymous'
          img.src = logoUrl
          img.onload = () => {
            const logoSize = s * 0.22
            const x = (s - logoSize) / 2
            const y = (s - logoSize) / 2
            ctx.fillStyle = lightColor
            ctx.fillRect(x - 3, y - 3, logoSize + 6, logoSize + 6)
            ctx.drawImage(img, x, y, logoSize, logoSize)
            setQrDataUri(canvas.toDataURL('image/png'))
          }
        } else {
          setQrDataUri(canvas.toDataURL('image/png'))
        }
      }
    )
  }

  useEffect(() => {
    generate()
    localStorage.setItem('qr_url', url)
  }, [url, darkColor, lightColor, size, logoUrl])

  const handleLogo = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setLogoUrl(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  return (
    <div style={styles.app}>
      <header style={styles.navbar}>
        <div style={styles.logoGroup}>
          <div style={styles.brandIcon} />
          <span style={styles.appTitle}>QR STUDIO</span>
        </div>
      </header>

      <section style={styles.hero}>
        <h1 style={styles.heroTitle}>Matrix QR Generator</h1>
        <p style={styles.heroSubtitle}>
          Generate high-resolution custom QR matrices with custom color controls.
        </p>
      </section>

      <main style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.stepNum}>01</span>
            <span style={styles.cardTitle}>TARGET URL</span>
          </div>

          <div style={styles.field}>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste link here (e.g., https://example.com)..."
              style={styles.textInput}
            />
          </div>

          <div style={styles.cardHeader}>
            <span style={styles.stepNum}>02</span>
            <span style={styles.cardTitle}>COLOR SCHEME</span>
          </div>

          <div style={styles.colorCustomRow}>
            <div style={styles.colorPickerBlock}>
              <span style={styles.pickerLabel}>FOREGROUND</span>
              <input
                type="color"
                value={darkColor}
                onChange={(e) => setDarkColor(e.target.value)}
                style={styles.colorInput}
              />
            </div>

            <div style={styles.colorPickerBlock}>
              <span style={styles.pickerLabel}>BACKGROUND</span>
              <input
                type="color"
                value={lightColor}
                onChange={(e) => setLightColor(e.target.value)}
                style={styles.colorInput}
              />
            </div>
          </div>

          <div style={styles.cardHeader}>
            <span style={styles.stepNum}>03</span>
            <span style={styles.cardTitle}>CONFIG & OVERLAY</span>
          </div>

          <div style={styles.rowTwoCol}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>DIMENSIONS</label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                style={styles.selectInput}
              >
                <option value="240">240 x 240 px</option>
                <option value="320">320 x 320 px</option>
                <option value="480">480 x 480 px</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={styles.label}>CENTER LOGO</label>
              <label style={styles.uploadZone}>
                {logoUrl ? '✓ LOGO ATTACHED' : '+ ATTACH IMAGE'}
                <input type="file" accept="image/*" onChange={handleLogo} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>

        <div style={styles.cardPreview}>
          <div style={styles.previewHeader}>
            <span style={styles.previewTitle}>LIVE PREVIEW</span>
            <span style={styles.activePill}>{qrDataUri ? 'READY' : 'WAITING'}</span>
          </div>

          <div style={styles.previewFrame}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {qrDataUri ? (
              <img src={qrDataUri} alt="QR Code" style={styles.qrImg} />
            ) : (
              <span style={styles.emptyPlaceholder}>Enter a URL to generate matrix</span>
            )}
          </div>

          {qrDataUri && (
            <a href={qrDataUri} download="qr-matrix.png" style={styles.downloadBtn}>
              EXPORT PNG ➔
            </a>
          )}
        </div>
      </main>
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#0c0c0e',
    color: '#f4f4f5',
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    padding: '36px 24px',
    boxSizing: 'border-box',
  },
  navbar: {
    maxWidth: '1040px',
    margin: '0 auto 40px auto',
    paddingBottom: '20px',
    borderBottom: '1px solid #1f1f23',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  brandIcon: {
    width: '12px',
    height: '12px',
    borderRadius: '3px',
    background: 'linear-gradient(135deg, #e06d53 0%, #b84d35 100%)',
  },
  appTitle: {
    fontSize: '0.85rem',
    fontWeight: '800',
    letterSpacing: '0.14em',
    color: '#f4f4f5',
  },
  hero: {
    maxWidth: '1040px',
    margin: '0 auto 36px auto',
  },
  heroTitle: {
    fontSize: '2.4rem',
    fontWeight: '800',
    letterSpacing: '-0.03em',
    color: '#fafafa',
    margin: '0 0 8px 0',
  },
  heroSubtitle: {
    fontSize: '0.95rem',
    color: '#8e8e93',
    margin: 0,
  },
  grid: {
    maxWidth: '1040px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '32px',
    alignItems: 'start',
  },
  card: {
    backgroundColor: '#141417',
    border: '1px solid #232328',
    borderRadius: '14px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '22px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '8px',
    borderBottom: '1px solid #232328',
  },
  stepNum: {
    fontSize: '0.75rem',
    fontWeight: '800',
    color: '#e06d53',
  },
  cardTitle: {
    fontSize: '0.725rem',
    fontWeight: '800',
    letterSpacing: '0.12em',
    color: '#8e8e93',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  textInput: {
    width: '100%',
    padding: '12px 14px',
    backgroundColor: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '8px',
    color: '#e06d53',
    fontSize: '0.9rem',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
  },
  colorCustomRow: {
    display: 'flex',
    gap: '12px',
  },
  colorPickerBlock: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#09090b',
    border: '1px solid #27272a',
    padding: '8px 12px',
    borderRadius: '8px',
  },
  pickerLabel: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#71717a',
  },
  colorInput: {
    width: '26px',
    height: '26px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#71717a',
    marginBottom: '6px',
    display: 'block',
  },
  rowTwoCol: {
    display: 'flex',
    gap: '16px',
  },
  selectInput: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#09090b',
    border: '1px solid #27272a',
    borderRadius: '8px',
    color: '#f4f4f5',
    fontSize: '0.85rem',
    outline: 'none',
  },
  uploadZone: {
    display: 'block',
    textAlign: 'center',
    padding: '12px',
    backgroundColor: '#09090b',
    border: '1px dashed #3f3f46',
    borderRadius: '8px',
    color: '#e06d53',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
  },
  cardPreview: {
    backgroundColor: '#141417',
    border: '1px solid #232328',
    borderRadius: '14px',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  previewHeader: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewTitle: {
    fontSize: '0.725rem',
    fontWeight: '800',
    letterSpacing: '0.12em',
    color: '#8e8e93',
  },
  activePill: {
    fontSize: '0.65rem',
    color: '#e06d53',
    backgroundColor: 'rgba(224, 109, 83, 0.12)',
    padding: '3px 8px',
    borderRadius: '12px',
    fontWeight: '800',
  },
  previewFrame: {
    width: '100%',
    minHeight: '320px',
    backgroundColor: '#09090b',
    border: '1px solid #232328',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  qrImg: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '6px',
  },
  emptyPlaceholder: {
    fontSize: '0.8rem',
    color: '#52525b',
    textAlign: 'center',
  },
  downloadBtn: {
    width: '100%',
    textAlign: 'center',
    padding: '14px',
    backgroundColor: '#e06d53',
    color: '#ffffff',
    fontWeight: '800',
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    borderRadius: '8px',
    textDecoration: 'none',
    boxSizing: 'border-box',
  },
}