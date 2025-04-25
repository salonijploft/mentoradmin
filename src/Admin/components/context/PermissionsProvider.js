import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        const loadRolePermissions = () => {
            const rolePermissionsCookie = Cookies.get('rolePermissions');
            if (rolePermissionsCookie) {
                const rolePermissionsArray = JSON.parse(rolePermissionsCookie);
                setPermissions(rolePermissionsArray);
            }
        };

        loadRolePermissions();
    }, []);

    const hasPermission = (moduleName, action) => {
        const permission = permissions.find(permission => permission.moduleName === moduleName);
        return permission ? permission[action] === 1 : false; // Check if the action is granted
    };

    return (
        <PermissionsContext.Provider value={{ permissions, hasPermission }}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => {
    return useContext(PermissionsContext);
};