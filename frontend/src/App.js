import { useEffect, useState } from 'react'
import './index.css'

const API_URL = 'https://payroll-analytics-dashboard.onrender.com/api/employees'

export default function App() {
  const [employees, setEmployees] = useState([])
  const [form, setForm] = useState({ name: '', email: '', salary: '' })
  const [loading, setLoading] = useState(true)

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
    fetchEmployees()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, salary: Number(form.salary) }),
      })
      setForm({ name: '', email: '', salary: '' })
      fetchEmployees()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">💸 Payroll Analytics</h1>
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
          <button type="submit" className="gradient-btn">Add</button>
        </form>

        <section className="grid">
          {loading && <p>Loading...</p>}
          {!loading && employees.length === 0 && <p>No employees yet.</p>}
          {employees.map((emp) => (
            <div className="card employee-card" key={emp._id}>
              <div className="avatar">{emp.name?.[0]?.toUpperCase()}</div>
              <h3>{emp.name}</h3>
              <p className="email">{emp.email}</p>
              <p className="salary">₹{emp.salary?.toLocaleString()}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
            }
