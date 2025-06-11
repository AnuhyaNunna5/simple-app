import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import './employeeForm.css'; 
import './EmployeeDetails.css';


// Bind modal to app root
Modal.setAppElement('#root');

const EmployeeDetails = () => {
  const { empId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/employees/${empId}`)
      .then((response) => setEmployee(response.data))
      .catch(() => setError('Failed to fetch employee details'));
  }, [empId]);

  const openModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage('');
  };

  if (error) {
    return <div className="form-container"><p className="error">{error}</p></div>;
  }

  if (!employee) {
    return <div className="form-container"><p>Loading...</p></div>;
  }

  return (
    <div className="form-container">
      <Link to="/employees">
        <button className="back-button">Back to List</button>
      </Link>
      <h2>Employee Details</h2>
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
            <td>{employee.departmentName}</td>
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

export default EmployeeDetails;