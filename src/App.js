import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// styles
import "./App.css";

// pages & components
import Navbar from "./components/Navbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Create from "./pages/create/Create";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Query from "./pages/query/Query";
import Profile from "./pages/profile/Profile";
import UpdateProfile from "./pages/profile/UpdateProfile";
import Announcement from "./pages/announcement/Announcement";
import Resolved from "./pages/resolved/Resolved";
import Sidebar from "./components/Sidebar";

function App() {
  const { authIsReady, user } = useAuthContext();
  console.log(user);

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && user.emailVerified && <Sidebar />}
          <div className="container">
            <Navbar />
            <Routes>
              <Route
                exact
                path="/"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Dashboard />
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/login"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Navigate to="/" />
                    ) : (
                      <Login />
                    )
                  ) : (
                    <Login />
                  )
                }
              />
              <Route
                path="/signup"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Navigate to="/" />
                    ) : (
                      <Signup />
                    )
                  ) : (
                    <Signup />
                  )
                }
              />
              <Route
                path="/query/:id"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Query />
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/profile/:id"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Profile />
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/update-profile"
                element={
                  user ? (
                    user.emailVerified ? (
                      <UpdateProfile />
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/create"
                element={
                  user ? (
                    user.emailVerified ? (
                      user.photoURL === "student" ? (
                        <Create />
                      ) : (
                        <Navigate to="/" />
                      )
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/resolved"
                element={
                  user ? (
                    user.emailVerified ? (
                      <Resolved />
                    ) : (
                      <Navigate to="/login" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/announcement"
                element={
                  user ? (
                    user.emailVerified && user.photoURL !== "student" ? (
                      <Announcement />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;
