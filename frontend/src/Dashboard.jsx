function Dashboard({ employees }) {
  const totalEmployees = employees.length
  const totalPayroll = employees.reduce((sum, e) => sum + (e.salary || 0), 0)
  const avgSalary = totalEmployees ? Math.round(totalPayroll / totalEmployees) : 0

  const deptMap = {}
  employees.forEach(e => {
    const dept = e.department || 'Unassigned'
    if (!deptMap[dept]) deptMap[dept] = { count: 0, total: 0 }
    deptMap[dept].count += 1
    deptMap[dept].total += e.salary || 0
  })
  const deptStats = Object.entries(deptMap)
    .map(([dept, d]) => ({ dept, count: d.count, total: d.total }))
    .sort((a, b) => b.total - a.total)

  const maxTotal = Math.max(...deptStats.map(d => d.total), 1)
  const maxCount = Math.max(...deptStats.map(d => d.count), 1)

  const topEarner = [...employees].sort((a, b) => (b.salary || 0) - (a.salary || 0))[0]

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="stats-row">
        <div className="stat-card">
          <p className="stat-label">Total Employees</p>
          <p className="stat-value">{totalEmployees}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Payroll</p>
          <p className="stat-value">₹{totalPayroll.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Average Salary</p>
          <p className="stat-value">₹{avgSalary.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Top Earner</p>
          <p className="stat-value">{topEarner ? topEarner.name : '—'}</p>
        </div>
      </div>

      <h3>Payroll by Department</h3>
      <div className="chart-bars">
        {deptStats.map(d => (
          <div className="chart-bar-row" key={d.dept}>
            <span className="chart-bar-label">{d.dept}</span>
            <div className="chart-bar-track">
              <div className="chart-bar-fill" style={{ width: `${(d.total / maxTotal) * 100}%` }}></div>
            </div>
            <span className="chart-bar-value">₹{d.total.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <h3>Headcount by Department</h3>
      <div className="chart-bars">
        {deptStats.map(d => (
          <div className="chart-bar-row" key={d.dept + '-count'}>
            <span className="chart-bar-label">{d.dept}</span>
            <div className="chart-bar-track">
              <div className="chart-bar-fill count-bar" style={{ width: `${(d.count / maxCount) * 100}%` }}></div>
            </div>
            <span className="chart-bar-value">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
