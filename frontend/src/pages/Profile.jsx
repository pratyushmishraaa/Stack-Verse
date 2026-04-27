import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import styles from '../Stylesheets/Profile.module.css'

const DIFF_COLOR = { beginner: '#22c55e', intermediate: '#f59e0b', advanced: '#ef4444' }
const DIFF_LABEL = { beginner: 'Easy', intermediate: 'Medium', advanced: 'Hard' }

const TABS = [
  { id: 'profile',     label: '👤 Profile',     },
  { id: 'submissions', label: '📋 Submissions',  },
  { id: 'settings',    label: '⚙️ Settings',     },
]

export default function Profile() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'profile'

  const [submissions, setSubmissions] = useState([])
  const [subLoading,  setSubLoading]  = useState(false)

  // Profile edit state
  const [username, setUsername] = useState(user?.username || '')
  const [avatar,   setAvatar]   = useState(user?.avatar   || '')
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState('')
  const [saveErr,  setSaveErr]  = useState('')

  // Password change state
  const [curPwd,  setCurPwd]  = useState('')
  const [newPwd,  setNewPwd]  = useState('')
  const [confPwd, setConfPwd] = useState('')
  const [pwdMsg,  setPwdMsg]  = useState('')
  const [pwdErr,  setPwdErr]  = useState('')

  // Delete account state
  const [delPwd,     setDelPwd]     = useState('')
  const [delConfirm, setDelConfirm] = useState(false)
  const [delErr,     setDelErr]     = useState('')

  const fileRef = useRef(null)

  useEffect(() => {
    if (activeTab === 'submissions' && submissions.length === 0) {
      setSubLoading(true)
      api.get('/submissions/my')
        .then(r => setSubmissions(r.data))
        .catch(console.error)
        .finally(() => setSubLoading(false))
    }
  }, [activeTab])

  // ── Avatar upload (base64 preview) ──────────────────────────────────────────
  const handleAvatarFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setSaveErr('Image must be under 2MB'); return }
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  // ── Save profile ─────────────────────────────────────────────────────────────
  const saveProfile = async (e) => {
    e.preventDefault()
    setSaveErr(''); setSaveMsg(''); setSaving(true)
    try {
      const { data } = await api.put('/auth/profile', { username, avatar })
      updateUser(data)
      setSaveMsg('Profile updated successfully!')
    } catch (err) {
      setSaveErr(err.response?.data?.message || 'Failed to update profile')
    } finally { setSaving(false) }
  }

  // ── Change password ───────────────────────────────────────────────────────────
  const changePassword = async (e) => {
    e.preventDefault()
    setPwdErr(''); setPwdMsg('')
    if (newPwd !== confPwd) { setPwdErr('New passwords do not match'); return }
    if (newPwd.length < 6)  { setPwdErr('Password must be at least 6 characters'); return }
    try {
      await api.put('/auth/profile', { currentPassword: curPwd, newPassword: newPwd })
      setPwdMsg('Password changed successfully!')
      setCurPwd(''); setNewPwd(''); setConfPwd('')
    } catch (err) {
      setPwdErr(err.response?.data?.message || 'Failed to change password')
    }
  }

  // ── Delete account ────────────────────────────────────────────────────────────
  const deleteAccount = async () => {
    setDelErr('')
    try {
      await api.delete('/auth/profile', { data: { password: delPwd } })
      logout()
      navigate('/')
    } catch (err) {
      setDelErr(err.response?.data?.message || 'Failed to delete account')
    }
  }

  const setTab = (t) => setSearchParams({ tab: t })

  return (
    <div className={styles.page}>
      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.sideAvatar}>
          {user?.avatar
            ? <img src={user.avatar} alt="" className={styles.sideAvatarImg} />
            : <span>{user?.username?.[0]?.toUpperCase()}</span>
          }
        </div>
        <div className={styles.sideName}>{user?.username}</div>
        <div className={styles.sideEmail}>{user?.email}</div>
        <span className={styles.sideRole}>{user?.role}</span>

        <nav className={styles.sideNav}>
          {TABS.map(t => (
            <button
              key={t.id}
              className={`${styles.sideNavBtn} ${activeTab === t.id ? styles.sideNavActive : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* ── Main content ── */}
      <main className={styles.main}>

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Profile</h2>
            <p className={styles.sectionSub}>Update your display name and profile picture</p>

            <form className={styles.form} onSubmit={saveProfile}>
              {/* Avatar picker */}
              <div className={styles.avatarPicker}>
                <div className={styles.avatarPreview} onClick={() => fileRef.current?.click()}>
                  {avatar
                    ? <img src={avatar} alt="" className={styles.avatarPreviewImg} />
                    : <span className={styles.avatarInitial}>{user?.username?.[0]?.toUpperCase()}</span>
                  }
                  <div className={styles.avatarOverlay}>📷 Change</div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarFile} />
                <div className={styles.avatarActions}>
                  <button type="button" className={styles.btnSecondary} onClick={() => fileRef.current?.click()}>
                    Upload Photo
                  </button>
                  {avatar && (
                    <button type="button" className={styles.btnDanger} onClick={() => setAvatar('')}>
                      Remove Photo
                    </button>
                  )}
                  <p className={styles.hint}>JPG, PNG or GIF · Max 2MB</p>
                </div>
              </div>

              <div className={styles.formRow}>
                <label className={styles.label}>
                  Username
                  <input
                    className={styles.input}
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Your username"
                  />
                </label>
                <label className={styles.label}>
                  Email <span className={styles.readOnly}>(cannot be changed)</span>
                  <input className={`${styles.input} ${styles.inputDisabled}`} value={user?.email} disabled />
                </label>
              </div>

              {saveMsg && <div className={styles.successMsg}>{saveMsg}</div>}
              {saveErr && <div className={styles.errorMsg}>{saveErr}</div>}

              <button className={styles.btnPrimary} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* ── SUBMISSIONS TAB ── */}
        {activeTab === 'submissions' && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>My Submissions</h2>
            <p className={styles.sectionSub}>{submissions.length} problem{submissions.length !== 1 ? 's' : ''} solved</p>

            {subLoading ? (
              <p className={styles.empty}>Loading...</p>
            ) : submissions.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <p>No submissions yet</p>
                <Link to="/problems" className={styles.btnPrimary}>Browse Problems →</Link>
              </div>
            ) : (
              <div className={styles.subList}>
                {submissions.map(s => (
                  <Link to={`/problems/${s.problem?._id}`} key={s._id} className={styles.subRow}>
                    <div className={styles.subMain}>
                      <span className={styles.subTitle}>{s.problem?.title}</span>
                      <span className={styles.subDate}>{new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <span className={styles.subCat}>{s.problem?.category}</span>
                    <span className={styles.subDiff} style={{ color: DIFF_COLOR[s.problem?.difficulty] }}>
                      {DIFF_LABEL[s.problem?.difficulty]}
                    </span>
                    <span className={styles.subArrow}>→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div className={styles.settingsCol}>

            {/* Change Password */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Change Password</h2>
              <p className={styles.sectionSub}>Use a strong password you don't use elsewhere</p>
              <form className={styles.form} onSubmit={changePassword}>
                <label className={styles.label}>
                  Current Password
                  <input className={styles.input} type="password" value={curPwd} onChange={e => setCurPwd(e.target.value)} required />
                </label>
                <label className={styles.label}>
                  New Password
                  <input className={styles.input} type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} required />
                </label>
                <label className={styles.label}>
                  Confirm New Password
                  <input className={styles.input} type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} required />
                </label>
                {pwdMsg && <div className={styles.successMsg}>{pwdMsg}</div>}
                {pwdErr && <div className={styles.errorMsg}>{pwdErr}</div>}
                <button className={styles.btnPrimary}>Update Password</button>
              </form>
            </div>

            {/* Danger Zone */}
            <div className={`${styles.section} ${styles.dangerSection}`}>
              <h2 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>⚠️ Danger Zone</h2>
              <p className={styles.sectionSub}>Permanently delete your account and all your data. This cannot be undone.</p>

              {!delConfirm ? (
                <button className={styles.btnDangerOutline} onClick={() => setDelConfirm(true)}>
                  Delete My Account
                </button>
              ) : (
                <div className={styles.delConfirmBox}>
                  <p className={styles.delWarning}>
                    This will permanently delete your account and all submissions. Enter your password to confirm.
                  </p>
                  <input
                    className={styles.input}
                    type="password"
                    placeholder="Enter your password"
                    value={delPwd}
                    onChange={e => setDelPwd(e.target.value)}
                  />
                  {delErr && <div className={styles.errorMsg}>{delErr}</div>}
                  <div className={styles.delActions}>
                    <button className={styles.btnDanger} onClick={deleteAccount} disabled={!delPwd}>
                      Yes, Delete My Account
                    </button>
                    <button className={styles.btnSecondary} onClick={() => { setDelConfirm(false); setDelPwd(''); setDelErr('') }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  )
}
