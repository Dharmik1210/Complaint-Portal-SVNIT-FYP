import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

// styles
import "./Navbar.css";

//SVNIT LOGO
import Logo from "../assets/NIT_Surat_Logo.svg";

export default function Navbar() {
  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={Logo} alt="SVNIT logo" />
          <span className="opened">Web-based Complaint Portal</span>
          <span className="closed">Complaint Portal</span>
        </li>
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>
        )}
        {user && user.emailVerified && (
          <li>
            {!isPending && (
              <button className="btn" onClick={logout}>
                Logout
              </button>
            )}
            {isPending && (
              <button className="btn" disabled>
                Logging out...
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}
