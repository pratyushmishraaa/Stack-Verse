import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import CodeEditor from '../components/CodeEditor'
import styles from '../Stylesheets/ProblemDetail.module.css'

const DIFF_COLOR = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }
const DIFF_LABEL = { beginner: 'Easy', intermediate: 'Medium', advanced: 'Hard' }
const TABS = [
  { id: 'html',       label: 'HTML',       icon: '🌐' },
  { id: 'css',        label: 'CSS',        icon: '🎨' },
  { id: 'javascript', label: 'JavaScript', icon: '⚡' },
]

const BLANK = { html: '', css: '', javascript: '' }

export default function ProblemDetail() {
  const { id }   = useParams()
  const { user } = useAuth()

  const [problem,    setProblem]    = useState(null)
  const [submission, setSubmission] = useState(null)
  const [code,       setCode]       = useState(BLANK)
  const [activeTab,  setActiveTab]  = useState('html')
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [autocomplete, setAutocomplete] = useState(true)
  const [previewKey,   setPreviewKey]   = useState(0)

  // Panel sizing
  const [descWidth, setDescWidth] = useState(320)
  const dragging = useRef(false)
  const startX   = useRef(0)
  const startW   = useRef(0)

  useEffect(() => {
    Promise.all([
      api.get(`/problems/${id}`),
      user ? api.get(`/submissions/${id}`).catch(() => null) : Promise.resolve(null),
    ]).then(([pRes, sRes]) => {
      setProblem(pRes.data)
      if (sRes?.data) { setSubmission(sRes.data); setCode(sRes.data.code) }
      else setCode(BLANK)
    }).catch(console.error).finally(() => setLoading(false))
  }, [id, user])

  // Auto-refresh preview 1s after code changes
  useEffect(() => {
    const t = setTimeout(() => setPreviewKey(k => k + 1), 1000)
    return () => clearTimeout(t)
  }, [code])

  // Drag to resize description panel
  const onMouseDown = (e) => {
    dragging.current = true
    startX.current   = e.clientX
    startW.current   = descWidth
    e.preventDefault()
  }
  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return
      const delta = e.clientX - startX.current
      setDescWidth(Math.max(220, Math.min(520, startW.current + delta)))
    }
    const onUp = () => { dragging.current = false }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [])

  const handleSubmit = async () => {
    if (!user) return
    setSubmitting(true)
    try {
      const res = await api.post('/submissions', { problemId: id, code, note: '' })
      setSubmission(res.data)
      alert('Solution submitted!')
    } catch { alert('Submission failed') }
    finally { setSubmitting(false) }
  }

  const openInBrowser = () => {
    const html = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${problem?.title || 'Preview'}</title>
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif}${code.css}</style>
</head><body>${code.html}<script>
window.onerror=(m,u,l)=>{document.body.innerHTML+='<div style="background:#ef4444;color:#fff;padding:10px;margin:10px;border-radius:6px;font-family:monospace"><b>Error:</b> '+m+' (line '+l+')</div>';return false};
${code.javascript}<\/script></body></html>`
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }

  const downloadFiles = () => {
    const files = [
      { name: 'index.html', content: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${problem?.title}</title><link rel="stylesheet" href="style.css"></head><body>${code.html}<script src="script.js"><\/script></body></html>` },
      { name: 'style.css',  content: code.css },
      { name: 'script.js',  content: code.javascript },
    ]
    files.forEach(f => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(new Blob([f.content], { type: 'text/plain' }))
      a.download = f.name; a.click()
    })
  }

  const resetCode = () => {
    if (confirm('Clear all your code?')) setCode(BLANK)
  }

  const previewDoc = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>*{box-sizing:border-box}body{margin:0;font-family:system-ui,sans-serif;line-height:1.6}${code.css}</style>
</head><body>${code.html}<script>
window.onerror=(m,u,l)=>{document.body.innerHTML+='<div style="background:#ef4444;color:#fff;padding:10px;margin:10px;border-radius:6px;font-family:monospace;font-size:13px"><b>JS Error:</b> '+m+' (line '+l+')</div>';return false};
const _log=console.log;console.log=(...a)=>{_log(...a);const d=document.createElement('div');d.style.cssText='background:#1e40af;color:#fff;padding:6px 12px;margin:4px;border-radius:4px;font-family:monospace;font-size:12px';d.textContent='▶ '+a.join(' ');document.body.appendChild(d)};
${code.javascript}<\/script></body></html>`

  if (loading) return <div className={styles.loading}><span>Loading...</span></div>
  if (!problem) return <div className={styles.loading}><span>Problem not found</span></div>

  return (
    <div className={styles.page}>
      {/* ── Top Bar ── */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span
            className={styles.diffBadge}
            style={{ color: DIFF_COLOR[problem.difficulty], borderColor: DIFF_COLOR[problem.difficulty] + '44', background: DIFF_COLOR[problem.difficulty] + '18' }}
          >
            {DIFF_LABEL[problem.difficulty]}
          </span>
          <span className={styles.catBadge}>{problem.category}</span>
          <h1 className={styles.problemTitle}>{problem.title}</h1>
        </div>
        <div className={styles.topbarRight}>
          <button
            className={`${styles.acToggle} ${autocomplete ? styles.acOn : styles.acOff}`}
            onClick={() => setAutocomplete(v => !v)}
            title="Toggle syntax suggestions"
          >
            {autocomplete ? '⚡ Suggestions ON' : '⚡ Suggestions OFF'}
          </button>
          <button className={styles.actionBtn} onClick={openInBrowser}>🔗 Browser</button>
          <button className={styles.actionBtn} onClick={downloadFiles}>💾 Download</button>
          <button className={styles.actionBtn} onClick={resetCode}>🔄 Reset</button>
          {user && (
            <button className={styles.submitBtn} onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : submission ? 'Update' : 'Submit'}
            </button>
          )}
        </div>
      </div>

      {/* ── Main 3-panel layout ── */}
      <div className={styles.workspace}>

        {/* Panel 1 — Problem Description */}
        <div className={styles.descPanel} style={{ width: descWidth }}>
          <div className={styles.descScroll}>
            <div className={styles.descSection}>
              <h2 className={styles.descHeading}>Problem</h2>
              <p className={styles.descText}>{problem.description}</p>
            </div>

            {problem.requirements?.length > 0 && (
              <div className={styles.descSection}>
                <h2 className={styles.descHeading}>Requirements</h2>
                <ul className={styles.reqList}>
                  {problem.requirements.map((r, i) => (
                    <li key={i} className={styles.reqItem}>
                      <span className={styles.reqCheck}>✓</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {problem.resources?.length > 0 && (
              <div className={styles.descSection}>
                <h2 className={styles.descHeading}>Resources</h2>
                <div className={styles.resources}>
                  {problem.resources.map((r, i) => (
                    <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className={styles.resourceLink}>
                      ↗ {r.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {problem.tags?.length > 0 && (
              <div className={styles.descSection}>
                <div className={styles.tags}>
                  {problem.tags.map(t => <span key={t} className={styles.tag}>{t}</span>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Drag handle */}
        <div className={styles.dragHandle} onMouseDown={onMouseDown} />

        {/* Panel 2 — Code Editor */}
        <div className={styles.editorPanel}>
          <div className={styles.tabBar}>
            {TABS.map(t => (
              <button
                key={t.id}
                className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
            <div className={styles.tabSpacer} />
            <span className={styles.lineInfo}>
              {(code[activeTab] || '').split('\n').length} lines
            </span>
          </div>
          <div className={styles.editorBody}>
            <CodeEditor
              key={activeTab}
              language={activeTab}
              value={code[activeTab]}
              autocomplete={autocomplete}
              onChange={val => setCode(prev => ({ ...prev, [activeTab]: val }))}
            />
          </div>
        </div>

        {/* Panel 3 — Live Preview */}
        <div className={styles.previewPanel}>
          <div className={styles.previewBar}>
            <span className={styles.previewTitle}>🔍 Live Preview</span>
            <div className={styles.previewDots}>
              <span className={styles.dot} style={{ background: '#ef4444' }} />
              <span className={styles.dot} style={{ background: '#f59e0b' }} />
              <span className={styles.dot} style={{ background: '#22c55e' }} />
            </div>
            <button className={styles.previewRefresh} onClick={() => setPreviewKey(k => k + 1)} title="Refresh">↺</button>
            <button className={styles.previewRefresh} onClick={openInBrowser} title="Open in browser">⤢</button>
          </div>
          <iframe
            key={previewKey}
            className={styles.previewFrame}
            srcDoc={previewDoc}
            title="Live Preview"
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  )
}
