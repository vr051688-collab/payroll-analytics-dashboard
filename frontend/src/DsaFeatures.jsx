import { useState, useEffect } from 'react';

const API_URL = 'https://payroll-analytics-dashboard.onrender.com';

function DsaFeatures() {
  const [topPaid, setTopPaid] = useState([]);
  const [deptData, setDeptData] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortedList, setSortedList] = useState([]);
  const [leaveQueue, setLeaveQueue] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/employees/top-paid`).then(r => r.json()).then(setTopPaid);
    fetch(`${API_URL}/api/analytics/department`).then(r => r.json()).then(setDeptData);
    fetch(`${API_URL}/api/leaves/queue`).then(r => r.json()).then(setLeaveQueue);
  }, []);

  const handleSearch = async () => {
    const res = await fetch(`${API_URL}/api/employees/search/${searchId}`);
    if (res.ok) setSearchResult(await res.json());
    else setSearchResult({ error: 'Not found' });
  };

  const handleSort = async (order) => {
    setSortOrder(order);
    const res = await fetch(`${API_URL}/api/employees/sorted-salary?algo=quick&order=${order}`);
    setSortedList(await res.json());
  };

  return (
  <div className="dsa-section">
    <h2>Top 10 Highest Paid</h2>
    <table className="dsa-table">
      <thead><tr><th>Name</th><th>Dept</th><th>Salary</th></tr></thead>
      <tbody>
        {topPaid.map(e => (
          <tr key={e._id}><td>{e.name}</td><td>{e.department}</td><td>₹{e.salary}</td></tr>
        ))}
      </tbody>
    </table>

    <h2>Department-wise Analytics</h2>
    <table className="dsa-table">
      <thead><tr><th>Department</th><th>Count</th><th>Avg Salary</th><th>Total Salary</th></tr></thead>
      <tbody>
        {deptData.map(d => (
          <tr key={d.department}>
            <td>{d.department}</td><td>{d.count}</td>
            <td>₹{d.avgSalary}</td><td>₹{d.totalSalary}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <h2>Search Employee (Binary Search)</h2>
    <div className="dsa-search-row">
      <input className="dsa-input" value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Employee ID e.g. E003" />
      <button className="gradient-btn" onClick={handleSearch}>Search</button>
    </div>
    {searchResult && (
      <p className="dsa-result">
        {searchResult.error
          ? searchResult.error
          : `${searchResult.name} — ${searchResult.department} — ₹${searchResult.salary}`}
      </p>
    )}

    <h2>Salary Sort</h2>
    <div className="dsa-btn-row">
      <button className="gradient-btn" onClick={() => handleSort('desc')}>High to Low</button>
      <button className="gradient-btn-outline" onClick={() => handleSort('asc')}>Low to High</button>
    </div>
    <ul className="dsa-list">
      {sortedList.map(e => <li key={e._id}>{e.name} — ₹{e.salary}</li>)}
    </ul>

    <h2>Leave Approval Queue</h2>
    <ul className="dsa-list">
      {leaveQueue.map((l, i) => <li key={i}>{l.employeeId} — {l.reason}</li>)}
    </ul>
  </div>
  );
}

export default DsaFeatures;
