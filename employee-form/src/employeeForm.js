import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './employeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    sonOf: '',
    dob: '',
    doj: '',
    gender: '',
    skillIds: [],
    wingId: '',
    departmentId: '',
    address: '',
    photo: null,
  });
  const [skills, setSkills] = useState([]);
  const [wings, setWings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/skills')
      .then((response) => setSkills(response.data))
      .catch(() => setError('Failed to fetch skills'));

    axios
      .get('http://localhost:8080/api/wings')
      .then((response) => setWings(response.data))
      .catch(() => setError('Failed to fetch wings'));
  }, []);

  useEffect(() => {
    if (formData.wingId) {
      axios
        .get(`http://localhost:8080/api/department?wingId=${formData.wingId}`)
        .then((response) => {
          console.log('Departments:', response.data);
          setDepartments(response.data);
        })
        .catch(() => setError('Failed to fetch departments'));
    } else {
      setDepartments([]);
      setFormData((prev) => ({ ...prev, departmentId: '' }));
    }
  }, [formData.wingId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === 'wingId' || name === 'departmentId' ? (value ? Number(value) : '') : value,
      };
      if (name === 'wingId') {
        newData.departmentId = ''; // Reset departmentId when wingId changes
      }
      return newData;
    });
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedSkillIds = checked
        ? [...prev.skillIds, Number(value)]
        : prev.skillIds.filter((id) => id !== Number(value));
      return { ...prev, skillIds: updatedSkillIds };
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    const employeeDTO = {
      name: formData.name,
      sonOf: formData.sonOf,
      dob: formData.dob,
      doj: formData.doj,
      gender: formData.gender,
      address: formData.address,
      wingId: Number(formData.wingId),
      departmentId: formData.departmentId ? Number(formData.departmentId) : null,
      skillIds: formData.skillIds,
    };
    console.log('Submitting:', employeeDTO);
    form.append('employee', new Blob([JSON.stringify(employeeDTO)], { type: 'application/json' }));
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
      const response = await axios.post('http://localhost:8080/api/employees', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data);
      setFormData({
        name: '',
        sonOf: '',
        dob: '',
        doj: '',
        gender: '',
        skillIds: [],
        wingId: '',
        departmentId: '',
        address: '',
        photo: null,
      });
      setDepartments([]);
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to submit form: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Employee Registration Form</h2>
      {console.log('Current formData:', formData)} {/* Debug */}
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sonOf">S/o./D/o:</label>
          <input
            type="text"
            id="sonOf"
            name="sonOf"
            value={formData.sonOf}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth:</label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="doj">Date of Joining:</label>
          <input
            type="date"
            id="doj"
            name="doj"
            value={formData.doj}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
              />
              Female
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Other"
                checked={formData.gender === 'Other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>
        <div className="form-group">
          <label>Skills:</label>
          <div className="checkbox-group">
            {skills.map((skill) => (
              <label key={skill.id}>
                <input
                  type="checkbox"
                  value={skill.id}
                  checked={formData.skillIds.includes(skill.id)}
                  onChange={handleSkillsChange}
                />
                {skill.name}
              </label>
            ))}
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="wingId">Wing:</label>
          <select
            id="wingId"
            name="wingId"
            value={formData.wingId}
            onChange={handleChange}
            required
          >
            <option value="">Select Wing</option>
            {wings.map((wing) => (
              <option key={wing.id} value={wing.id}>
                {wing.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="departmentId">Department:</label>
          <select
            id="departmentId"
            name="departmentId"
            value={formData.departmentId}
            onChange={handleChange}
            disabled={!formData.wingId}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photo">Photo:</label>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          {formData.photo && (
            <img
              src={URL.createObjectURL(formData.photo)}
              alt="Preview"
              className="photo-preview"
            />
          )}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EmployeeForm;