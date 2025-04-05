import { useState } from "react";
import { usePasswordReset } from "../hooks/usePasswordReset";
import "./PasswordReset.css";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [message, setMessage] = useState(false);
  const { passwordReset, error } = usePasswordReset();

  const handleSubmit = async (e) => {
    setEmailErr("");
    e.preventDefault();
    if (email.trim() == "") {
      setEmailErr("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailErr("Invalid email address.");
      return;
    }
    await passwordReset(email.trim());
    setMessage(true);
  };

  return (
    <div className="password-reset">
      <form onSubmit={handleSubmit}>
        <h2>Password Reset</h2>
        <label>
          <span>Email:</span>
          <input
            type="text"
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailErr("");
            }}
            value={email}
          />
        </label>
        {emailErr && <p className="error">{emailErr}</p>}
        {!message &&
          <button
            className="btn"
            type="submit"
          >Reset Password</button>}
        {/* {message && (
          <button className="btn" disabled>
            Wait
          </button>
        )} */}
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
