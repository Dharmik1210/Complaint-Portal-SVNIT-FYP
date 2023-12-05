import { useState, useEffect } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";
import "./PasswordReset.css";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState(null);
  const [message, setMessage] = useState(false);
  const { passwordReset, error } = usePasswordReset();

  useEffect(() => {
    setEmailErr(null);
  }, [email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    passwordReset(email);
    setMessage(true);
  };

  return (
    <div className="password-reset">
      <form onSubmit={handleSubmit}>
        <h2>Password Reset</h2>
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
        {!message && <button className="btn">Reset Password</button>}
        {message && (
          <button className="btn" disabled>
            Wait
          </button>
        )}
        {error && <p className="error">{error}</p>}
        {message && (
          <div className="msg">
            <p>
              Please make sure you entered right email. Check your mailbox,
              including the spam folder, for a password reset email.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
