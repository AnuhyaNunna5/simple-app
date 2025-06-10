import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './employeeForm.css';
import './EmployeeDetails.css';

// Bind modal to app root
Modal.setAppElement('#root');

const EmployeeDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/employees/${id}`)
      .then((response) => setEmployee(response.data))
      .catch(() => setError('Failed to fetch employee details'));
  }, [id]);

  const validateRemarks = (value) => {
    if (!value || value.trim().length === 0) {
      return 'Remarks are required';
    }
    if (value.length < 10) {
      return 'Remarks must be at least 10 characters';
    }
    if (value.length > 500) {
      return 'Remarks must not exceed 500 characters';
    }
    return '';
  };

  const handleRemarksChange = (e) => {
    const value = e.target.value;
    setRemarks(value);
    setValidationError(validateRemarks(value));
  };

  const handleDelete = async () => {
    const validation = validateRemarks(remarks);
    if (validation) {
      setValidationError(validation);
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/employees/${id}`, {
        data: { remarks },
      });
      alert('Employee deleted successfully');
      navigate('/employees');
    } catch (err) {
      setError(
        `Failed to delete employee: ${
          err.response?.data || err.message
        }`
      );
    }
  };

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  if (error) {
    return (
      <div className="form-container">
        <Link to="/employees">
          <button className="back-button">Back to List</button>
        </Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="form-container">
        <Link to="/employees">
          <button className="back-button">Back to List</button>
        </Link>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Link to="/employees">
        <button className="back-button">Back to List</button>
      </Link>
      <h2>Delete Employee Confirmation</h2>
      <p>Are you sure you want to delete the following employee?</p>
      <table className="employee-details-table">
        <tbody>
          <tr>
            <td>Name</td>
            <td>{employee.name}</td>
          </tr>
          <tr>
            <td>S/O or D/O</td>
            <td>{employee.sonOf || '-'}</td>
          </tr>
          <tr>
            <td>Date of Birth</td>
            <td>{employee.dob}</td>
          </tr>
          <tr>
            <td>Age</td>
            <td>{employee.age}</td>
          </tr>
          <tr>
            <td>Date of Joining</td>
            <td>{employee.doj}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{employee.gender}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>{employee.address || '-'}</td>
          </tr>
          <tr>
            <td>Wing</td>
            <td>{employee.wingName}</td>
          </tr>
          <tr>
            <td>Department</td>
            <td>{employee.departmentName || '-'}</td>
          </tr>
          <tr>
            <td>Skills</td>
            <td>{employee.skillNames || '-'}</td>
          </tr>
          <tr>
            <td>Photo</td>
            <td>
              {employee.photoBase64 ? (
                <span onClick={() => openModal(`data:image/jpeg;base64,${employee.photoBase64}`)}>
                  <img
                    src={`data:image/jpeg;base64,${employee.photoBase64}`}
                    alt="Employee"
                    className="photo-preview"
                  />
                </span>
              ) : (
                '-'
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Work Experiences</h3>
      {employee.workExperiences && employee.workExperiences.length > 0 ? (
        <table className="work-experience-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Company Name</th>
              <th>Job Role</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>Experience (Years)</th>
            </tr>
          </thead>
          <tbody>
            {employee.workExperiences.map((exp, index) => (
              <tr key={index}>
                <td>{exp.location || '-'}</td>
                <td>{exp.companyName || '-'}</td>
                <td>{exp.jobRole || '-'}</td>
                <td>{exp.fromDate || '-'}</td>
                <td>{exp.toDate || '-'}</td>
                <td>{exp.experienceYears || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No work experiences available.</p>
      )}

      <div className="form-group">
        <label htmlFor="remarks">Remarks (required, 10-500 characters):</label>
        <textarea
          id="remarks"
          value={remarks}
          onChange={handleRemarksChange}
          className={`form-control ${validationError ? 'error-border' : ''}`}
          rows="4"
          style={{
            border: validationError ? '1px solid red' : '1px solid #ddd',
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
          }}
          placeholder="Enter reason for deletion (e.g., Employee left due to relocation)"
        />
        {validationError && <p className="error">{validationError}</p>}
      </div>

      <div style={{ marginTop: '20px' }}>
        <button
          className="delete-button"
          onClick={handleDelete}
          disabled={!!validationError}
          style={{
            backgroundColor: 'rgb(150, 50, 50)',
            color: 'white',
            padding: '10px',
            marginRight: '10px',
            border: validationError ? 'none' : '1px',
            borderRadius: '4px',
            cursor: validationError ? 'not-allowed' : 'pointer',
            opacity: validationError ? 0.5 : 1,
          }}
        >
          Confirm Delete
        </button>
        <Link to="/employees">
          <button className="back-button">Cancel</button>
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <button onClick={closeModal} className="modal-close">×</button>
        <img src={modalImage} alt="Full Size" className="modal-image" />
      </Modal>
    </div>
  );
};

export default EmployeeDelete;