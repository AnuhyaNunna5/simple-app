import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EmployeeList.css';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/employees')
      .then((response) => setEmployees(response.data))
      .catch(() => setError('Failed to fetch employees'));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`http://localhost:8080/api/employees/${id}`);
        setEmployees(employees.filter((emp) => emp.id !== id));
        alert('Employee deleted successfully');
      } catch (err) {
        setError(`Failed to delete employee: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  return (
    <div className="form-container">
      <h2>List of Employees</h2>
      <Link to="/employee-form">
        <button className="register-button">Employee Registration</button>
      </Link>
      {error && <p className="error">{error}</p>}
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>S/O or D/O</th>
            <th>Gender</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.name}</td>
              <td>{employee.sonOf || '-'}</td>
              <td>{employee.gender}</td>
              <td>{employee.doj}</td>
              <td>
                <Link to={`/employees/${employee.id}`}>
                  <button className="view-button">View Details</button>
                </Link>
                <Link to={`/employee-form/edit/${employee.id}`}>
                  <button className="edit-button">Edit</button>
                </Link>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;