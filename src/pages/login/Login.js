import { useState, useEffect } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useVerification } from '../../hooks/useVerification';
import { useAuthContext } from '../../hooks/useAuthContext';

// styles
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationTimer, setVerificationTimer] = useState(0);
  const { login, isPending, error } = useLogin();
  const { verification, error: verificationError } = useVerification();
  const { user } = useAuthContext();

  useEffect(() => {
    const timer =
      verificationTimer > 0 &&
      setInterval(() => setVerificationTimer(verificationTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [verificationTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  const handleVerification = (e) => {
    e.preventDefault();
    setVerificationTimer(120);
    verification(user);
  };

  return (
    <div className="login">
      {!user && (
        <form onSubmit={handleSubmit}>
          <h2>Login</h2>
          <label>
            <span>Email:</span>
            <input
              type="text"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label>
            <span>Password:</span>
            <input
              type="password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </label>
          {!isPending && <button className="btn">Log in</button>}
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
