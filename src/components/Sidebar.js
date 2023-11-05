import { NavLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

// styles & images
import './Sidebar.css';
import ProfileIcon from '../assets/profile_icon.svg';
import DashboardIcon from '../assets/dashboard_icon.svg';
import ResolvedIcon from '../assets/resolved_icon.svg';
import AddIcon from '../assets/add_icon.svg';

export default function Sidebar() {
  const { user } = useAuthContext();

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          <p>Hi, {user.displayName}</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/resolved">
                <img src={ResolvedIcon} alt="resolved icon" />
                <span>Resolved</span>
              </NavLink>
            </li>
            <li>
              <NavLink to={`/profile/${user.uid}`}>
                <img src={ProfileIcon} alt="profile icon" />
                <span>My Profile</span>
              </NavLink>
            </li>

            {user.photoURL === 'student' && (
              <li>
                <NavLink to="/create">
                  <img src={AddIcon} alt="add query icon" />
                  <span>New Complaint</span>
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
