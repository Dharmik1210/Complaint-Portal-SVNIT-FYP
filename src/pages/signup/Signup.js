import { useState, useEffect } from 'react';
import { useSignup } from '../../hooks/useSignup';
import { useVerification } from '../../hooks/useVerification';
import { useAuthContext } from '../../hooks/useAuthContext';
import './Signup.css';
import Select from 'react-select';

const customStyles = {
  control: (provided) => ({
    ...provided,
    cursor: 'pointer',

    '&:hover': {
      cursor: 'pointer',
    },
  }),
  option: (provided, state) => ({
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

export default function Login() {
  const [email, setEmail] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [admissionNo, setAdmissionNo] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [mobileNoError, setMobileNoError] = useState('');
  const [department, setDepartment] = useState(null);
  const [departmentErr, setDepartmentErr] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [verificationTimer, setVerificationTimer] = useState(0);
  const { signup, isPending, error } = useSignup();
  const { verification, error: verificationError } = useVerification();
  const { user } = useAuthContext();

  useEffect(() => {
    setPasswordError('');
    setMobileNoError('');
    setDepartmentErr('');
    setEmailErr('');
  }, [password, confirmPassword, mobileNo, department, email]);

  useEffect(() => {
    const timer =
      verificationTimer > 0 &&
      setInterval(() => setVerificationTimer(verificationTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [verificationTimer]);

  const handleNestedChange = (option) => {
    setDepartment(option);
  };

  const isValid = () => {
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    if (!department) {
      setDepartmentErr('Select Department');
      return false;
    }
    if (!mobileNo.match(/^\d{10}$/)) {
      setMobileNoError('Invalid Mobile Number');
      return false;
    }
    if (!email.endsWith('svnit.ac.in')) {
      setEmailErr('Please enter svnit email');
    } else {
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValid()) {
      const userDetails = {
        email,
        admissionNo,
        name,
        mobileNo,
        department: department.value,
        currentAddress,
        adminType: 'student',
        complaints: [],
      };
      // console.log(userDetails, password);
      signup(userDetails, password);
    }
  };

  const handleVerification = (e) => {
    e.preventDefault();
    setVerificationTimer(60);
    verification(user);
  };
  return (
    <div className="signup">
      {!user && (
        <form onSubmit={handleSubmit}>
          <h2>Signup</h2>
          <label>
            <span>Email:</span>
            <input
              type="email"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          {emailErr && <p className="error">{emailErr}</p>}
          <label>
            <span>Password:</span>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          <label>
            <span>Confirm Password:</span>
            <input
              type="password"
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </label>
          {passwordError && <p className="error">{passwordError}</p>}
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
            <span>Name:</span>
            <input
              type="text"
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
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
          <label>
            <span>Department:</span>
            <Select
              styles={customStyles}
              onChange={handleNestedChange}
              options={departmentOptions}
            />
          </label>
          {departmentErr && <p className="error">{departmentErr}</p>}
          <label>
            <span>Current Address (hostel/quarters):</span>
            <input
              type="text"
              required
              onChange={(e) => setCurrentAddress(e.target.value)}
              value={currentAddress}
            />
          </label>
          {!isPending && <button className="btn">Sign up</button>}
          {isPending && (
            <button className="btn" disabled>
              loading
            </button>
          )}
          {error && <div className="error">{error}</div>}
        </form>
      )}
      {user && (
        <div>
          {verificationTimer > 0 && (
            <div className="verification-guide">
              <p className="timer-text">
                Time remaining: {verificationTimer} seconds
              </p>
              <p>
                Please check your mailbox, including the spam folder, for a
                verification email. If you haven't received the email, you can
                click "Verify Email" again after the timer expires.
              </p>
            </div>
          )}
          {verificationTimer === 0 && (
            <div className="verification-guide">
              <p>Please click on the button to verify yourself.</p>
            </div>
          )}
          <button
            disabled={verificationTimer > 0}
            onClick={handleVerification}
            className="btn"
          >
            Verify Email
          </button>
          {verificationTimer > 0 && (
            <div>
              <p className="verification-guide">
                Please refresh the page to access your account after successful
                verification.
              </p>
            </div>
          )}
          {verificationError && (
            <div className="error">{verificationError}</div>
          )}
        </div>
      )}
    </div>
  );
}
