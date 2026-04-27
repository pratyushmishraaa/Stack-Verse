import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from '../Stylesheets/Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const dropRef = useRef(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = () => { setOpen(false); logout(); navigate('/') }

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        StackVerse
      </Link>

      <div className={styles.links}>
        <Link to="/problems" className={`${styles.link} ${pathname === '/problems' ? styles.active : ''}`}>
          Problems
        </Link>

        {user ? (
          <div className={styles.userMenu} ref={dropRef}>
            <button className={styles.userBtn} onClick={() => setOpen(v => !v)}>
              <div className={styles.userAvatar}>
                {user.avatar
                  ? <img src={user.avatar} alt="" className={styles.avatarImg} />
                  : <span>{user.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <span className={styles.userGreeting}>Hi, {user.username}</span>
              <span className={`${styles.chevron} ${open ? styles.chevronUp : ''}`}>▾</span>
            </button>

            {open && (
              <div className={styles.dropdown}>
                <div className={styles.dropHeader}>
                  <div className={styles.dropAvatar}>
                    {user.avatar
                      ? <img src={user.avatar} alt="" className={styles.avatarImg} />
                      : <span>{user.username?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div>
                    <div className={styles.dropName}>{user.username}</div>
                    <div className={styles.dropEmail}>{user.email}</div>
                  </div>
                </div>
                <div className={styles.dropDivider} />
                <Link to="/profile" className={styles.dropItem} onClick={() => setOpen(false)}>
                  <span>👤</span> My Profile
                </Link>
                <Link to="/profile?tab=submissions" className={styles.dropItem} onClick={() => setOpen(false)}>
                  <span>📋</span> My Submissions
                </Link>
                <Link to="/profile?tab=settings" className={styles.dropItem} onClick={() => setOpen(false)}>
                  <span>⚙️</span> Settings
                </Link>
                <div className={styles.dropDivider} />
                <button className={styles.dropItemDanger} onClick={handleLogout}>
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login"    className={`${styles.link} ${pathname === '/login' ? styles.active : ''}`}>Login</Link>
            <Link to="/register" className={styles.registerBtn}>Get Started</Link>
          </>
        )}
      </div>
    </nav>
  )
}
