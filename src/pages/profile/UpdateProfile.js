import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';
import Swal from 'sweetalert2';
// styles
import './UpdateProfile.css';

const customStyles = {
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',

    '&:hover': {
      cursor: 'pointer',
    },
  }),
  option: (provided) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

const departmentOptions = [
  { value: 'CSE', label: 'CSE' },
  { value: 'AI', label: 'AI' },
  { value: 'ECE', label: 'ECE' },
  { value: 'EE', label: 'EE' },
  { value: 'ME', label: 'ME' },
  { value: 'CE', label: 'CE' },
  { value: 'CH', label: 'CH' },
  { value: 'Chemistry', label: 'Chemistry' },
  { value: 'Mathematics', label: 'Mathematics' },
  { value: 'Physics', label: 'Physics' },
  { value: 'Management Studies', label: 'Management Studies' },
  { value: 'Humanities', label: 'Humanities' },

  // Add other department options here
];

export default function UpdateProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const { updateDocument } = useFirestore('users');

  const user = {
    name: location.state.name,
    admissionNo: location.state.admissionNo,
    department: {
      value: location.state.department,
      label: location.state.department,
    },
    currentAddress: location.state.currentAddress,
    mobileNo: location.state.mobileNo,
  };

  const [name, setName] = useState(user.name);
  const [admissionNo, setAdmissionNo] = useState(user.admissionNo);
  const [department, setDepartment] = useState(user.department);
  const [currentAddress, setCurrentAddress] = useState(user.currentAddress);
  const [mobileNo, setMobileNo] = useState(user.mobileNo);
  const [mobileNoError, setMobileNoError] = useState('');

  useEffect(() => {
    setMobileNoError('');
  }, [mobileNo]);

  const handleNestedChange = (option) => {
    setDepartment(option);
  };

  const isValid = () => {
    if (!mobileNo.match(/^\d{10}$/)) {
      setMobileNoError('Invalid Mobile Number');
      return false;
    }

    return true;
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    if (isValid()) {
      const { id, ...updatedUser } = location.state;
      updatedUser.name = name;
      updatedUser.admissionNo = admissionNo;
      updatedUser.department = department.value;
      updatedUser.currentAddress = currentAddress;
      updatedUser.mobileNo = mobileNo;
      updateDocument(id, updatedUser);
      Swal.fire('Success!', 'User Profile has been updated.', 'success');
      navigate(`/`);
    }
  };

  return (
    <form className="update-form" onSubmit={handleUpdate}>
      <h2>Update Profile</h2>
      <label>
        <span>Name:</span>
        <input
          type="text"
          required
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>
      <label>
        <span>Admission No / Employee ID:</span>
        <input
          type="text"
          required
          onChange={(e) => setAdmissionNo(e.target.value)}
          value={admissionNo}
        />
      </label>
      <label>
        <span>Department:</span>
        <Select
          styles={customStyles}
          onChange={handleNestedChange}
          options={departmentOptions}
          // value={department}
          defaultValue={department}
        />
      </label>
      <label>
        <span>Current Address:</span>
        <input
          type="text"
          required
          onChange={(e) => setCurrentAddress(e.target.value)}
          value={currentAddress}
        />
      </label>
      <label>
        <span>Contact:</span>
        <input
          type="tel"
          required
          onChange={(e) => setMobileNo(e.target.value)}
          value={mobileNo}
        />
      </label>
      {mobileNoError && <p className="error">{mobileNoError}</p>}
      <button className="btn">Update</button>
    </form>
  );
}
