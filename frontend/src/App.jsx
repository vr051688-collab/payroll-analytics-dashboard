import { useEffect, useState } from 'react'
import './index.css'
import DsaFeatures from './DsaFeatures'
import Login from './Login'
import Signup from './Signup'
import ForgotPassword from './ForgotPassword'

const API_URL = 'https://payroll-analytics-dashboard.onrender.com/api/employees'

export default function App() {
  const [authView, setAuthView] = useState('login') // 'login' | 'signup' | 'forgot'
  const [token, setToken] = useState(localStorage.getItem('token'))

  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ name: '', email: '', salary: '', department: '' })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All')

  const fetchEmployees = async () => {
    try {
      const res = await fetch(API_URL)
      const data = await res.json()
      setEmployees(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (token) fetchEmployees()
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, salary: Number(form.salary) }),
      })
      setForm({ name: '', email: '', salary: '', department: '' })
      fetchEmployees()
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setAuthView('login')
  }

  if (!token) {
    if (authView === 'signup') {
      return <Signup onSignupSuccess={() => setAuthView('login')} switchToLogin={() => setAuthView('login')} />
    }
    if (authView === 'forgot') {
      return <ForgotPassword switchToLogin={() => setAuthView('login')} />
    }
    return (
      <Login
        onLogin={(t) => setToken(t)}
        switchToSignup={() => setAuthView('signup')}
        switchToForgot={() => setAuthView('forgot')}
      />
    )
  }

  const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))]

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(search.toLowerCase())
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter
    return matchesSearch && matchesDept
  })

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">💸 Payroll Analytics</h1>
        <button className="gradient-btn-outline logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="main">
        <form className="card form-card" onSubmit={handleSubmit}>
          <h2>Add Employee</h2>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            placeholder="Salary"
            type="number"
            value={form.salary}
            onChange={(e) => setForm({ ...form, salary: e.target.value })}
            required
          />
          <input
            placeholder="Department"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            required
          />
          <button type="submit" className="gradient-btn">Add</button>
        </form>

        <div className="filter-row">
          <input
            className="dsa-input"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="dsa-input"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <section className="grid">
          {loading && <p>Loading...</p>}
          {!loading && filteredEmployees.length === 0 && <p>No employees found.</p>}
          {filteredEmployees.map((emp) => (
            <div className="card employee-card" key={emp._id}>
              <div className="avatar">{emp.name?.[0]?.toUpperCase()}</div>
              <h3>{emp.name}</h3>
              <p className="email">{emp.email}</p>
              {emp.department && <p className="dept-tag">{emp.department}</p>}
              <p className="salary">₹{emp.salary?.toLocaleString()}</p>
            </div>
          ))}
        </section>

        <DsaFeatures />
      </main>
    </div>
  )
          }
