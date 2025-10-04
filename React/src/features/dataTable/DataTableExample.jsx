// Sample data for demonstration
export const sampleData = [
  {
    id: 1,
    name: 'John Doe',
    age: 32,
    email: 'john.doe@example.com',
    department: 'Engineering',
    salary: 75000,
    status: 'Active',
    joinDate: '2022-01-15',
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 28,
    email: 'jane.smith@example.com',
    department: 'Marketing',
    salary: 65000,
    status: 'Active',
    joinDate: '2022-03-20',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    age: 35,
    email: 'mike.johnson@example.com',
    department: 'Sales',
    salary: 70000,
    status: 'Inactive',
    joinDate: '2021-11-10',
  },
  {
    id: 4,
    name: 'Sarah Wilson',
    age: 29,
    email: 'sarah.wilson@example.com',
    department: 'HR',
    salary: 60000,
    status: 'Active',
    joinDate: '2022-05-05',
  },
  {
    id: 5,
    name: 'David Brown',
    age: 42,
    email: 'david.brown@example.com',
    department: 'Engineering',
    salary: 85000,
    status: 'Active',
    joinDate: '2021-08-12',
  },
  {
    id: 6,
    name: 'Lisa Davis',
    age: 31,
    email: 'lisa.davis@example.com',
    department: 'Finance',
    salary: 72000,
    status: 'Active',
    joinDate: '2022-02-28',
  },
  {
    id: 7,
    name: 'Tom Wilson',
    age: 26,
    email: 'tom.wilson@example.com',
    department: 'Marketing',
    salary: 55000,
    status: 'Active',
    joinDate: '2022-07-15',
  },
  {
    id: 8,
    name: 'Emma Taylor',
    age: 33,
    email: 'emma.taylor@example.com',
    department: 'Engineering',
    salary: 78000,
    status: 'Active',
    joinDate: '2021-12-03',
  },
];

// Table columns configuration
export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name),
    filterable: true,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    sorter: (a, b) => a.age - b.age,
    width: 80,
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    sorter: (a, b) => a.email.localeCompare(b.email),
  },
  {
    title: 'Department',
    dataIndex: 'department',
    key: 'department',
    sorter: (a, b) => a.department.localeCompare(b.department),
    filters: [
      { text: 'Engineering', value: 'Engineering' },
      { text: 'Marketing', value: 'Marketing' },
      { text: 'Sales', value: 'Sales' },
      { text: 'HR', value: 'HR' },
      { text: 'Finance', value: 'Finance' },
    ],
    onFilter: (value, record) => record.department === value,
  },
  {
    title: 'Salary',
    dataIndex: 'salary',
    key: 'salary',
    sorter: (a, b) => a.salary - b.salary,
    render: (value) => `$${value.toLocaleString()}`,
    width: 120,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    sorter: (a, b) => a.status.localeCompare(b.status),
    filters: [
      { text: 'Active', value: 'Active' },
      { text: 'Inactive', value: 'Inactive' },
    ],
    onFilter: (value, record) => record.status === value,
    render: (status) => (
      <span
        style={{
          color: status === 'Active' ? '#52c41a' : '#ff4d4f',
          fontWeight: 'bold',
        }}
      >
        {status}
      </span>
    ),
    width: 100,
  },
  {
    title: 'Join Date',
    dataIndex: 'joinDate',
    key: 'joinDate',
    sorter: (a, b) => new Date(a.joinDate) - new Date(b.joinDate),
    width: 120,
  },
];

// Handler functions
export const handleExportExcel = async (exportData, selectedKeys) => {
  console.log(`Exporting ${selectedKeys.length > 0 ? selectedKeys.length : exportData.length} records...`);
  // Custom export logic can be implemented here
};

export const handlePrint = async (printData, selectedKeys) => {
  console.log(`Printing ${selectedKeys.length > 0 ? selectedKeys.length : printData.length} records...`);
  // Custom print logic can be implemented here
};

export const handleRefresh = () => {
  console.log('Refreshing data...');
  // Custom refresh logic can be implemented here
};

const DataTableExample = () => {
  return null; // This component is now just for exporting data and handlers
};

export default DataTableExample;
