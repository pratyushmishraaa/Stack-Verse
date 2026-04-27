import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import styles from '../Stylesheets/Problems.module.css'

const DIFFICULTIES = ['all', 'beginner', 'intermediate', 'advanced']
const CATEGORIES   = ['all', 'frontend', 'backend', 'fullstack', 'database', 'devops']

const DIFF_COLOR = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }
const DIFF_LABEL = { beginner: 'Easy', intermediate: 'Medium', advanced: 'Hard' }

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading]   = useState(true)
  const [params, setParams]     = useSearchParams()

  const difficulty = params.get('difficulty') || 'all'
  const category   = params.get('category')   || 'all'
  const search     = params.get('search')     || ''

  useEffect(() => {
    setLoading(true)
    const q = {}
    if (difficulty !== 'all') q.difficulty = difficulty
    if (category   !== 'all') q.category   = category
    if (search)               q.search     = search
    api.get('/problems', { params: q })
      .then(r => setProblems(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [difficulty, category, search])

  const set = (key, val) => {
    const next = new URLSearchParams(params)
    if (val === 'all' || val === '') next.delete(key)
    else next.set(key, val)
    setParams(next)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Problems</h1>
          <p className={styles.sub}>Pick a challenge and start building</p>
        </div>
        <input
          className={styles.search}
          placeholder="Search problems..."
          value={search}
          onChange={e => set('search', e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Difficulty</span>
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              className={`${styles.filterBtn} ${difficulty === d ? styles.active : ''}`}
              style={difficulty === d && d !== 'all' ? { borderColor: DIFF_COLOR[d], color: DIFF_COLOR[d] } : {}}
              onClick={() => set('difficulty', d)}
            >
              {d === 'all' ? 'All' : DIFF_LABEL[d]}
            </button>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Category</span>
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`${styles.filterBtn} ${category === c ? styles.active : ''}`}
              onClick={() => set('category', c)}
            >
              {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className={styles.loading}>Loading problems...</div>
      ) : problems.length === 0 ? (
        <div className={styles.empty}>No problems found. Try different filters.</div>
      ) : (
        <div className={styles.list}>
          {problems.map((p, i) => (
            <Link to={`/problems/${p._id}`} key={p._id} className={styles.row}>
              <span className={styles.rowNum}>{i + 1}</span>
              <div className={styles.rowMain}>
                <span className={styles.rowTitle}>{p.title}</span>
                <div className={styles.rowMeta}>
                  {p.tags?.slice(0, 4).map(t => (
                    <span key={t} className={styles.tag}>{t}</span>
                  ))}
                </div>
              </div>
              <span className={styles.rowCategory}>{p.category}</span>
              <span
                className={styles.rowDiff}
                style={{ color: DIFF_COLOR[p.difficulty] }}
              >
                {DIFF_LABEL[p.difficulty]}
              </span>
              <span className={styles.rowSolved}>{p.solvedCount ?? 0} solved</span>
              <span className={styles.rowArrow}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
