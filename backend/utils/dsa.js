// backend/utils/dsa.js

// ---- Binary Search (for employee search by ID, array must be sorted) ----
function binarySearchById(employees, targetId) {
  let low = 0, high = employees.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (employees[mid].employeeId === targetId) return employees[mid];
    if (employees[mid].employeeId < targetId) low = mid + 1;
    else high = mid - 1;
  }
  return null;
}

// ---- Quick Sort (salary sorting) ----
function quickSortBySalary(arr, ascending = true) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)].salary;
  const left = arr.filter(e => ascending ? e.salary < pivot : e.salary > pivot);
  const mid = arr.filter(e => e.salary === pivot);
  const right = arr.filter(e => ascending ? e.salary > pivot : e.salary < pivot);
  return [...quickSortBySalary(left, ascending), ...mid, ...quickSortBySalary(right, ascending)];
}

// ---- Merge Sort (salary sorting, stable) ----
function mergeSortBySalary(arr, ascending = true) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSortBySalary(arr.slice(0, mid), ascending);
  const right = mergeSortBySalary(arr.slice(mid), ascending);
  return merge(left, right, ascending);
}
function merge(left, right, ascending) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    const cond = ascending ? left[i].salary <= right[j].salary : left[i].salary >= right[j].salary;
    result.push(cond ? left[i++] : right[j++]);
  }
  return [...result, ...left.slice(i), ...right.slice(j)];
}

// ---- Hash Map (O(1) employee lookup by ID) ----
function buildEmployeeHashMap(employees) {
  const map = new Map();
  for (const emp of employees) map.set(emp.employeeId, emp);
  return map;
}

// ---- Queue (FIFO leave approval processing) ----
class LeaveApprovalQueue {
  constructor() { this.items = []; }
  enqueue(leaveRequest) { this.items.push(leaveRequest); }
  dequeue() { return this.items.shift(); }
  peek() { return this.items[0]; }
  isEmpty() { return this.items.length === 0; }
  size() { return this.items.length; }
  getAll() { return [...this.items]; }
}

// ---- Top 10 highest-paid (uses quick sort) ----
function getTopPaidEmployees(employees, n = 10) {
  return quickSortBySalary([...employees], false).slice(0, n);
}

// ---- Department-wise analytics (uses hash map grouping) ----
function getDepartmentAnalytics(employees) {
  const deptMap = new Map();
  for (const emp of employees) {
    if (!deptMap.has(emp.department)) {
      deptMap.set(emp.department, { department: emp.department, count: 0, totalSalary: 0, employees: [] });
    }
    const d = deptMap.get(emp.department);
    d.count++;
    d.totalSalary += emp.salary;
    d.employees.push(emp.name);
  }
  const result = [];
  for (const d of deptMap.values()) {
    result.push({ ...d, avgSalary: Math.round(d.totalSalary / d.count) });
  }
  return result;
}

module.exports = {
  binarySearchById,
  quickSortBySalary,
  mergeSortBySalary,
  buildEmployeeHashMap,
  LeaveApprovalQueue,
  getTopPaidEmployees,
  getDepartmentAnalytics
};
