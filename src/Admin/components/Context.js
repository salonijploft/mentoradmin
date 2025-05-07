// import React, { createContext, useContext, useState, useEffect } from 'react';
// import Cookies from 'js-cookie';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("token"));
//     useEffect(() => {
//         const token = Cookies.get("token");
//         setIsAuthenticated(!!token);
//     }, []);

//     const login = (token) => {
//         Cookies.set("token", token, { expires: 7 });
//         setIsAuthenticated(true);
//     };

//     const logout = () => {
//         Cookies.remove("token");
//         setIsAuthenticated(false);
//     };

//     return (
//         <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };