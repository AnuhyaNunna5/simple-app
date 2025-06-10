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
                <Link to={`/employees/delete/${employee.id}`}>
                  <button className="delete-button">Delete</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;