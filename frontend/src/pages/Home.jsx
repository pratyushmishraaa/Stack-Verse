import { Link } from 'react-router-dom'
import styles from '../Stylesheets/Home.module.css'

const stats = [
  { value: '3+', label: 'Challenges' },
  { value: '3', label: 'Difficulty Levels' },
  { value: '100%', label: 'Browser-based' },
]

const features = [
  { icon: '🧩', title: 'Real Problems', desc: 'Full-stack challenges — not toy algorithms. Build real UIs and apps.' },
  { icon: '⚡', title: 'Live Preview', desc: 'See your output instantly in the built-in browser preview panel.' },
  { icon: '🧠', title: 'Smart Editor', desc: 'VS Code-like editor with syntax suggestions, Emmet, and autocomplete.' },
  { icon: '📊', title: 'Track Progress', desc: 'Submit solutions and track what you have solved over time.' },
]

export default function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.badge}>Full-Stack Dev Platform</div>
        <h1 className={styles.title}>
          Test Your Skills.<br />
          <span className={styles.accent}>Build Real Things.</span>
        </h1>
        <p className={styles.sub}>
          Solve full-stack challenges directly in the browser. Write HTML, CSS and JavaScript,
          see the live preview, and submit your solution — all in one place.
        </p>
        <div className={styles.cta}>
          <Link to="/problems" className={styles.primaryBtn}>Browse Problems</Link>
          <Link to="/register" className={styles.secondaryBtn}>Create Account</Link>
        </div>
        <div className={styles.stats}>
          {stats.map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Everything you need to practice</h2>
        <div className={styles.grid}>
          {features.map(f => (
            <div key={f.title} className={styles.card}>
              <span className={styles.cardIcon}>{f.icon}</span>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.cta2}>
        <h2>Ready to start building?</h2>
        <p>Pick a problem and start coding right now — no setup required.</p>
        <Link to="/problems" className={styles.primaryBtn}>Start Solving →</Link>
      </section>
    </div>
  )
}
