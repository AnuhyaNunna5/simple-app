import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './employeeForm.css';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    sonOf: '',
    dob: '',
    age: 0,
    doj: '',
    gender: '',
    skillIds: [],
    wingId: '',
    departmentId: '',
    address: '',
    photo: null,
    workExperiences: [
      { location: '', companyName: '', jobRole: '', fromDate: '', toDate: '', experienceYears: 0 },
    ],
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const [skills, setSkills] = useState([]);
  const [wings, setWings] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    sonOf: '',
    dob: '',
    doj: '',
    gender: '',
    skillIds: '',
    wingId: '',
    departmentId: '',
    address: '',
    photo: '',
    workExperiences: [''],
  });

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/skills')
      .then((response) => setSkills(response.data))
      .catch(() => setError('Failed to fetch skills'));

    axios
      .get('http://localhost:8080/api/wings')
      .then((response) => setWings(response.data))
      .catch(() => setError('Failed to fetch wings'));

    if (id) {
      axios
        .get(`http://localhost:8080/api/employees/${id}`)
        .then((response) => {
          const employee = response.data;
          setFormData({
            name: employee.name || '',
            sonOf: employee.sonOf || '',
            dob: employee.dob || '',
            age: employee.age || 0,
            doj: employee.doj || '',
            gender: employee.gender || '',
            skillIds: employee.skillIds || [],
            wingId: employee.wingId || '',
            departmentId: employee.departmentId || '',
            address: employee.address || '',
            photo: null, // Photo re-upload required
            workExperiences: employee.workExperiences.length
              ? employee.workExperiences
              : [{ location: '', companyName: '', jobRole: '', fromDate: '', toDate: '', experienceYears: 0 }],
          });
          setErrors({
            name: '',
            sonOf: '',
            dob: '',
            doj: '',
            gender: '',
            skillIds: '',
            wingId: '',
            departmentId: '',
            address: '',
            photo: '',
            workExperiences: employee.workExperiences.map(() => '') || [''],
          });
        })
        .catch(() => setError('Failed to fetch employee data'));
    }
  }, [id]);

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

  const restrictInput = (e) => {
    const allowed = /^[a-zA-Z\s]*$/;
    if (!allowed.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateField = (name, value, index) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    console.log(`Validating ${name} with value:`, value, index !== undefined ? `index: ${index}` : '');
    if (name === 'workExperience') {
      const exp = formData.workExperiences[index];
      const fields = ['location', 'companyName', 'jobRole', 'fromDate', 'toDate'];
      const isAnyFilled = fields.some((field) => exp[field]);
      const isAllFilled = fields.every((field) => exp[field]);
      if (isAnyFilled && !isAllFilled) {
        console.log('Work experience error: Partial row', exp);
        return 'Please fill all fields in this row or leave it empty';
      }
      if (exp.fromDate && exp.toDate && new Date(exp.toDate) < new Date(exp.fromDate)) {
        console.log('Work experience error: toDate < fromDate', exp);
        return 'To Date must be after From Date';
      }
      if (exp.fromDate && new Date(exp.fromDate) > today) {
        console.log('Work experience error: fromDate future', exp);
        return 'From Date must be in the past';
      }
      if (exp.toDate && new Date(exp.toDate) > today) {
        console.log('Work experience error: toDate future', exp);
        return 'To Date must be in the past';
      }
      for (const field of ['location', 'jobRole']) {
        const fieldValue = exp[field];
        if (fieldValue && !/^[a-zA-Z\s]+$/.test(fieldValue)) {
          console.log(`Work experience error: ${field} invalid chars`, fieldValue);
          return `${field.charAt(0).toUpperCase() + field.slice(1)} must contain only letters and spaces`;
        }
        if (fieldValue && (fieldValue.length < 2 || fieldValue.length > 100)) {
          console.log(`Work experience error: ${field} length`, fieldValue);
          return `${field.charAt(0).toUpperCase() + field.slice(1)} must be 2–100 characters`;
        }
      }
      if (exp.companyName && (exp.companyName.length < 2 || exp.companyName.length > 100)) {
        console.log('Work experience error: companyName length', exp.companyName);
        return 'Company Name must be 2–100 characters';
      }
      // Check for overlapping work experiences
      if (exp.fromDate && exp.toDate) {
        const currentFrom = new Date(exp.fromDate);
        const currentTo = new Date(exp.toDate);
        for (let i = 0; i < formData.workExperiences.length; i++) {
          if (i !== index && formData.workExperiences[i].fromDate && formData.workExperiences[i].toDate) {
            const otherFrom = new Date(formData.workExperiences[i].fromDate);
            const otherTo = new Date(formData.workExperiences[i].toDate);
            if (currentFrom <= otherTo && currentTo >= otherFrom) {
              console.log('Work experience error: Overlap', { current: exp, other: formData.workExperiences[i] });
              return 'Dates overlap with another work experience';
            }
          }
        }
      }
      console.log('Work experience valid:', exp);
      return '';
    }
    switch (name) {
      case 'name':
        if (!value) return 'Name is required';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name must contain only letters and spaces';
        if (value.length < 2 || value.length > 50) return 'Name must be 2–50 characters';
        return '';
      case 'sonOf':
        if (value && !/^[a-zA-Z\s]+$/.test(value)) return 'S/o./D/o must contain only letters and spaces';
        if (value && (value.length < 2 || value.length > 50)) return 'S/o./D/o must be 2–50 characters';
        return '';
      case 'dob':
        if (!value) return 'DOB is required';
        const dobDate = new Date(value);
        const age = formData.age;
        if (dobDate > today) return 'DOB must be in the past';
        if (age < 18 || age > 100) return 'Age must be 18–100';
        return '';
      case 'doj':
        if (!value) return 'DOJ is required';
        const dojDate = new Date(value);
        const dobPlus18 = formData.dob
          ? new Date(new Date(formData.dob).setFullYear(new Date(formData.dob).getFullYear() + 18))
          : null;
        if (dojDate > today) return 'DOJ cannot be in the future';
        if (dobPlus18 && dojDate < dobPlus18) return 'DOJ must be after age 18';
        return '';
      case 'gender':
        if (!value) return 'Gender is required';
        return '';
      case 'skillIds':
        if (!value.length) return 'At least one skill is required';
        return '';
      case 'wingId':
        if (!value) return 'Wing is required';
        return '';
      case 'departmentId':
        if (!value && formData.wingId) return 'Department is required';
        return '';
      case 'address':
        if (!value) return 'Address is required';
        if (value.length < 10 || value.length > 200) return 'Address must be 10–200 characters';
        return '';
      case 'photo':
        if (value && !['image/jpeg', 'image/png'].includes(value.type)) return 'Photo must be JPEG or PNG';
        if (value && value.size > 2 * 1024 * 1024) return 'Photo must be ≤ 2MB';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`);
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: name === 'wingId' || name === 'departmentId' ? (value ? Number(value) : '') : value,
      };
      if (name === 'wingId') {
        newData.departmentId = '';
      }
      if (name === 'dob' && value) {
        const today = new Date();
        const birthDate = new Date(value);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        newData.age = age < 1 ? 0 : age;
      } else if (name === 'dob' && !value) {
        newData.age = 0;
      }
      return newData;
    });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSkillsChange = (e) => {
    const { value, checked } = e.target;
    const updatedSkillIds = checked
      ? [...formData.skillIds, Number(value)]
      : formData.skillIds.filter((id) => id !== Number(value));
    setFormData((prev) => ({ ...prev, skillIds: updatedSkillIds }));
    setErrors((prev) => ({ ...prev, skillIds: validateField('skillIds', updatedSkillIds) }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, photo: file }));
    setErrors((prev) => ({ ...prev, photo: validateField('photo', file) }));
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedExperiences = [...prev.workExperiences];
      updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
      if (field === 'fromDate' || field === 'toDate') {
        const { fromDate, toDate } = updatedExperiences[index];
        if (fromDate && toDate && new Date(toDate) >= new Date(fromDate)) {
          const diffYears =
            (new Date(toDate) - new Date(fromDate)) / (1000 * 60 * 60 * 24 * 365.25);
          updatedExperiences[index].experienceYears = Number(diffYears.toFixed(2));
        } else {
          updatedExperiences[index].experienceYears = 0;
        }
      }
      return { ...prev, workExperiences: updatedExperiences };
    });
    setErrors((prev) => {
      const newErrors = [...prev.workExperiences];
      newErrors[index] = validateField('workExperience', null, index);
      return { ...prev, workExperiences: newErrors };
    });
  };

  const handleAddExperience = () => {
    if (formData.workExperiences.length < 5) {
      setFormData((prev) => ({
        ...prev,
        workExperiences: [
          ...prev.workExperiences,
          { location: '', companyName: '', jobRole: '', fromDate: '', toDate: '', experienceYears: 0 },
        ],
      }));
      setErrors((prev) => ({ ...prev, workExperiences: [...prev.workExperiences, ''] }));
    }
  };

  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }));
    setErrors((prev) => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      sonOf: validateField('sonOf', formData.sonOf),
      dob: validateField('dob', formData.dob),
      doj: validateField('doj', formData.doj),
      gender: validateField('gender', formData.gender),
      skillIds: validateField('skillIds', formData.skillIds),
      wingId: validateField('wingId', formData.wingId),
      departmentId: validateField('departmentId', formData.departmentId),
      address: validateField('address', formData.address),
      photo: validateField('photo', formData.photo),
      workExperiences: formData.workExperiences.map((_, index) =>
        validateField('workExperience', null, index)
      ),
    };
    console.log('Form Validation Errors:', newErrors);
    setErrors(newErrors);
    const hasErrors =
      Object.keys(newErrors)
        .filter((key) => key !== 'workExperiences')
        .some((key) => newErrors[key]) || newErrors.workExperiences.some((err) => err);
    console.log('Has Errors:', hasErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix errors in the form.');
      return;
    }

    console.log('Work Experiences:', formData.workExperiences);
    const form = new FormData();
    const employeeDTO = {
      name: formData.name,
      sonOf: formData.sonOf,
      dob: formData.dob,
      age: formData.age,
      doj: formData.doj,
      gender: formData.gender,
      address: formData.address,
      wingId: Number(formData.wingId),
      departmentId: formData.departmentId ? Number(formData.departmentId) : null,
      skillIds: formData.skillIds,
      workExperiences: formData.workExperiences.filter((exp) =>
        ['location', 'companyName', 'jobRole', 'fromDate', 'toDate'].some((field) => exp[field])
      ),
    };
    console.log('Submitting:', employeeDTO);
    form.append('employee', new Blob([JSON.stringify(employeeDTO)], { type: 'application/json' }));
    if (formData.photo) {
      form.append('photo', formData.photo);
    }

    try {
      const url = id ? `http://localhost:8080/api/employees/${id}` : 'http://localhost:8080/api/employees';
      const method = id ? 'put' : 'post';
      const response = await axios({
        method,
        url,
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(id ? 'Employee updated successfully' : response.data);
      setFormData({
        name: '',
        sonOf: '',
        dob: '',
        age: 0,
        doj: '',
        gender: '',
        skillIds: [],
        wingId: '',
        departmentId: '',
        address: '',
        photo: null,
        workExperiences: [
          { location: '', companyName: '', jobRole: '', fromDate: '', toDate: '', experienceYears: 0 },
        ],
      });
      setDepartments([]);
      setErrors({
        name: '',
        sonOf: '',
        dob: '',
        doj: '',
        gender: '',
        skillIds: '',
        wingId: '',
        departmentId: '',
        address: '',
        photo: '',
        workExperiences: [''],
      });
      navigate('/employees');
    } catch (err) {
      console.error('Submission error:', err);
      setError(`Failed to submit form: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Edit Employee' : 'Employee Registration Form'}</h2>
      {console.log('Current formData:', formData)}
      {error && <p className="error">{error}</p>}
      <div className="top-button">
        <Link to="/employees">
          <button type="button" className="list-button">List of Employees</button>
        </Link>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onKeyPress={restrictInput}
            />
            {errors.name && <p className="error-inline">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="sonOf">S/o./D/o:</label>
            <input
              type="text"
              id="sonOf"
              name="sonOf"
              value={formData.sonOf}
              onChange={handleChange}
              onKeyPress={restrictInput}
            />
            {errors.sonOf && <p className="error-inline">{errors.sonOf}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="dob">Date of Birth:</label>
            <div className="dob-group">
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split('T')[0]}
              />
              <label htmlFor="age">Age:</label>
              <input
                type="text"
                className="age-field"
                value={formData.age}
                readOnly
                placeholder="Age"
              />
            </div>
            {errors.dob && <p className="error-inline">{errors.dob}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="doj">Date of Joining:</label>
            <input
              type="date"
              id="doj"
              name="doj"
              value={formData.doj}
              onChange={handleChange}
            />
            {errors.doj && <p className="error-inline">{errors.doj}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="radio-group">
              <label>Gender:</label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
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
                  value="Transgender"
                  checked={formData.gender === 'Transgender'}
                  onChange={handleChange}
                />
                Transgender
              </label>
            </div>
            {errors.gender && <p className="error-inline">{errors.gender}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <div className="checkbox-group">
              <label>Skills:</label>
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
            {errors.skillIds && <p className="error-inline">{errors.skillIds}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="wingId">Wing:</label>
            <select
              id="wingId"
              name="wingId"
              value={formData.wingId}
              onChange={handleChange}
            >
              <option value="">Select Wing</option>
              {wings.map((wing) => (
                <option key={wing.id} value={wing.id}>
                  {wing.name}
                </option>
              ))}
            </select>
            {errors.wingId && <p className="error-inline">{errors.wingId}</p>}
          </div>
          <div className="form-group">
            <label htmlFor="departmentId">Department:</label>
            <select
              id="departmentId"
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              disabled={!formData.wingId}
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="error-inline">{errors.departmentId}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
            {errors.address && <p className="error-inline">{errors.address}</p>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="photo">Photo:</label>
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {errors.photo && <p className="error-inline">{errors.photo}</p>}
            {formData.photo && (
              <img
                src={URL.createObjectURL(formData.photo)}
                alt="Preview"
                className="photo-preview"
              />
            )}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Previous Work Experience:</label>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            {formData.workExperiences.map((experience, index) => (
              <div key={index} className="experience-row">
                <div className="experience-fields">
                  <input
                    type="text"
                    placeholder="Location"
                    value={experience.location}
                    onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                    onKeyPress={restrictInput}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    value={experience.companyName}
                    onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Job Role"
                    value={experience.jobRole}
                    onChange={(e) => handleExperienceChange(index, 'jobRole', e.target.value)}
                    onKeyPress={restrictInput}
                  />
                  <input
                    type="date"
                    value={experience.fromDate}
                    onChange={(e) => handleExperienceChange(index, 'fromDate', e.target.value)}
                  />
                  <input
                    type="date"
                    value={experience.toDate}
                    onChange={(e) => handleExperienceChange(index, 'toDate', e.target.value)}
                  />
                  <input
                    type="text"
                    value={experience.experienceYears}
                    readOnly
                    placeholder="Years"
                  />
                  {index > 0 && (
                    <span
                      className="remove-button"
                      onClick={() => handleRemoveExperience(index)}
                      title="Remove"
                    >
                      ×
                    </span>
                  )}
                </div>
                {errors.workExperiences[index] && (
                  <p className="error-inline">{errors.workExperiences[index]}</p>
                )}
              </div>
            ))}
            {formData.workExperiences.length < 5 && (
              <span
                className="add-button"
                onClick={handleAddExperience}
                title="Add Experience"
              >
                +
              </span>
            )}
          </div>
        </div>
        <div className="button-group">
          <button type="submit">{id ? 'Update' : 'Submit'}</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;