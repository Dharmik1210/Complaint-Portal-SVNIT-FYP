// import React, { useState, useContext, useEffect } from 'react';
// const AppContext = React.createContext();

// const AppProvider = ({ children }) => {
//   const [userObj, setUserObj] = useState(null);
//   const [error, setError] = useState(null);
//   return (
//     <AppContext.Provider
//       value={{
//         userObj,
//         setUserObj,
//         error,
//         setError,
//       }}
//     >
//       {children}
//     </AppContext.Provider>
//   );
// };

// export const useGlobalContext = () => {
//   return useContext(AppContext);
// };

// export { AppContext, AppProvider };
