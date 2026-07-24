const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Employee = require('./models/Employee');
const authRoutes = require('./routes/auth');
const {
  binarySearchById, quickSortBySalary, mergeSortBySalary,
  buildEmployeeHashMap, LeaveApprovalQueue,
  getTopPaidEmployees, getDepartmentAnalytics
} = require('./utils/dsa');

const leaveQueue = new LeaveApprovalQueue();
const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => res.json({ message: 'Payroll API running' }));

app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/employees', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get('/api/employees/search/:id', async (req, res) => {
  const employees = await Employee.find().sort({ employeeId: 1 });
  const result = binarySearchById(employees, req.params.id);
  if (!result) return res.status(404).json({ message: 'Employee not found' });
  res.json(result);
});

app.get('/api/employees/sorted-salary', async (req, res) => {
  const { algo = 'quick', order = 'desc' } = req.query;
  const employees = await Employee.find();
  const ascending = order === 'asc';
  const sorted = algo === 'merge'
    ? mergeSortBySalary(employees, ascending)
    : quickSortBySalary(employees, ascending);
  res.json(sorted);
});

app.get('/api/employees/top-paid', async (req, res) => {
  const employees = await Employee.find();
  res.json(getTopPaidEmployees(employees, 10));
});

app.get('/api/analytics/department', async (req, res) => {
  const employees = await Employee.find();
  res.json(getDepartmentAnalytics(employees));
});

app.post('/api/leaves/request', (req, res) => {
  leaveQueue.enqueue({ ...req.body, requestedAt: new Date() });
  res.json({ message: 'Leave request queued', queueSize: leaveQueue.size() });
});

app.post('/api/leaves/approve-next', (req, res) => {
  if (leaveQueue.isEmpty()) return res.status(404).json({ message: 'No pending leaves' });
  const next = leaveQueue.dequeue();
  res.json({ message: 'Leave approved', leave: next, remaining: leaveQueue.size() });
});

app.get('/api/leaves/queue', (req, res) => {
  res.json(leaveQueue.getAll());
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
