import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../hooks/useLogin";
import { useVerification } from "../../hooks/useVerification";
import { useAuthContext } from "../../hooks/useAuthContext";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

// styles
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationTimer, setVerificationTimer] = useState(0);
  const [showPassword, setShowPassword] = useState(false)
  const { login, isPending, error } = useLogin();
  const [formError, setFormError] = useState("");
  const { verification, error: verificationError } = useVerification();
  const { user } = useAuthContext();

  useEffect(() => {
    const timer =
      verificationTimer > 0 &&
      setInterval(() => setVerificationTimer(verificationTimer - 1), 1000);
    return () => clearInterval(timer);
  }, [verificationTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.trim() == "") {
      setFormError("Email is required");
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setFormError("Invalid email address");
      return;
    }
    if (password.trim() == "") {
      setFormError("Password is required");
      return;
    }
    await login(email.trim(), password);
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
          <label htmlFor="email">
            <span>Email:</span>
            <input
              id="email"
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </label>
          <label htmlFor="password">
            <div className="input-wrapper-password">
              <span>Password:</span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                style={{ paddingRight: "40px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="eye-icon"
              >
                {password ? (!showPassword ? <FaRegEye /> : <FaRegEyeSlash />) : <></>}
              </span>
            </div>
          </label>

          {!isPending && <button className="btn">Login</button>}
          {isPending && (
            <button className="btn" disabled>
              Loading...
            </button>
          )}
          {error && <div className="error">{error}</div>}
          {formError && <div className="error">{formError}</div>}
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
      <div className="forget-password">
        <Link to="/password-reset">forgot password?</Link>
      </div>
    </div>
  );
}
