import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    
    const [rolePermissions, setRolePermissions] = useState([]);
    useEffect(() => {
        const permissions = Cookies.get('rolePermissions');
        if (permissions) {
            setRolePermissions(JSON.parse(permissions));
        }
    }, []);
 
    return (
        <UserContextProvider value={{ rolePermissions }}>
            {children}
        </UserContextProvider>
    );
};

export const useUser  = () => useContext(UserContext);