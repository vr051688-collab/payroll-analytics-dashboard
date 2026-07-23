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
    <div style={{ padding: '1.5rem' }}>
      <h2>Top 10 Highest Paid</h2>
      <table border="1" cellPadding="8">
        <thead><tr><th>Name</th><th>Dept</th><th>Salary</th></tr></thead>
        <tbody>
          {topPaid.map(e => (
            <tr key={e._id}><td>{e.name}</td><td>{e.department}</td><td>₹{e.salary}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Department-wise Analytics</h2>
      <table border="1" cellPadding="8">
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
      <input value={searchId} onChange={e => setSearchId(e.target.value)} placeholder="Employee ID e.g. E003" />
      <button onClick={handleSearch}>Search</button>
      {searchResult && (
        searchResult.error
          ? <p>{searchResult.error}</p>
          : <p>{searchResult.name} — {searchResult.department} — ₹{searchResult.salary}</p>
      )}

      <h2>Salary Sort</h2>
      <button onClick={() => handleSort('desc')}>High to Low</button>
      <button onClick={() => handleSort('asc')}>Low to High</button>
      <ul>
        {sortedList.map(e => <li key={e._id}>{e.name} — ₹{e.salary}</li>)}
      </ul>

      <h2>Leave Approval Queue</h2>
      <ul>
        {leaveQueue.map((l, i) => <li key={i}>{l.employeeId} — {l.reason}</li>)}
      </ul>
    </div>
  );
}

export default DsaFeatures;
