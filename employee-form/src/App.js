import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmployeeForm from './employeeForm';
import EmployeeList from './EmployeeList';
import EmployeeDetails from './EmployeeDetails';
import EmployeeDelete from './EmployeeDelete'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmployeeForm />} />
        <Route path="/employee-form" element={<EmployeeForm />} />
        <Route path="/employee-form/edit/:id" element={<EmployeeForm />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employees/:id" element={<EmployeeDetails />} />
        <Route path="/employees/delete/:id" element={<EmployeeDelete />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;