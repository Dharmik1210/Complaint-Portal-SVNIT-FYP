import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

// styles & images
import "./Sidebar.css";
import ProfileIcon from "../assets/profile_icon.svg";
import DashboardIcon from "../assets/dashboard_icon.svg";
import ResolvedIcon from "../assets/resolved_icon.svg";
import AddIcon from "../assets/add_icon.svg";
import AnnouncementIcon from "../assets/announcement_icon.svg";
import MenuIcon from "../assets/menu_icon.svg";

export default function Sidebar() {
  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(window.innerWidth <= 768 ? false : true);

  const handleClick = () => {
    if (window.innerWidth <= 768) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={isOpen ? "sidebar" : "sidebar-collapsed"}>
      <div className="sidebar-content">
        <div className="user">
          {!isOpen && (
            <img
              src={MenuIcon}
              alt="menu icon"
              onClick={() => setIsOpen(!isOpen)}
            />
          )}
          {isOpen && <span>Hi, {user.displayName}</span>}
        </div>
        <nav className="links">
          <ul>
            <li>
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                {isOpen && <span onClick={handleClick}>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/resolved">
                <img src={ResolvedIcon} alt="resolved icon" />
                {isOpen && <span onClick={handleClick}>Resolved</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to={`/profile/${user.uid}`}>
                <img src={ProfileIcon} alt="profile icon" />
                {isOpen && <span onClick={handleClick}>My Profile</span>}
              </NavLink>
            </li>

            {user.photoURL === "student" && (
              <li>
                <NavLink to="/create">
                  <img src={AddIcon} alt="add  icon" />
                  {isOpen && <span onClick={handleClick}>New Complaint</span>}
                </NavLink>
              </li>
            )}

            {user.photoURL !== "student" && (
              <li>
                <NavLink to="/announcement">
                  <img src={AnnouncementIcon} alt="add announcement icon" />
                  {isOpen && <span onClick={handleClick}>Announcement</span>}
                </NavLink>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
