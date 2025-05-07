import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

// Create the UserContext
const UserContext = createContext();

// Create the UserProvider component
export const UserProvider = ({ children }) => {
    const [rolePermissions, setRolePermissions] = useState([]);

    useEffect(() => {
        const permissions = Cookies.get('rolePermissions');
        console.log("permissions inside cookies:", permissions)
        if (permissions) {
            const parsedPermissions = JSON.parse(permissions);
            console.log('Parsed Permissions:', parsedPermissions); // Log the parsed permissions
            setRolePermissions(parsedPermissions);
        }
    }, []);

    return (
        // Use UserContext.Provider to provide the rolePermissions to children
        <UserContext.Provider value={{ rolePermissions }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser  = () => useContext(UserContext);