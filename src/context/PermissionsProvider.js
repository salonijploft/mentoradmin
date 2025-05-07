// import React, { createContext, useContext, useEffect, useState } from 'react';
// import Cookies from 'js-cookie';

// const PermissionsContext = createContext();

// export const PermissionsProvider = ({ children }) => {
//     const [permissions, setPermissions] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const loadRolePermissions = () => {
//             try {
//                 const rolePermissionsCookie = Cookies.get('rolePermissions');
                
//                 if (!rolePermissionsCookie) {
//                     setPermissions([]);
//                     return;
//                 }

//                 const parsedPermissions = JSON.parse(rolePermissionsCookie);
                
//                 if (!Array.isArray(parsedPermissions)) {
//                     throw new Error('Permissions data is not an array');
//                 }
//                 setPermissions(parsedPermissions);
//             } catch (err) {
//                 console.error('Failed to load permissions:', err);
//                 setError(err);
//                 setPermissions([]);
//                 // Clear invalid cookie
//                 Cookies.remove('rolePermissions');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadRolePermissions();
//     }, []);

//     const hasPermission = (moduleName, action) => {
//         if (error) return false;
//         if (loading) return false; // Or your preferred loading behavior
        
//         return permissions.some(
//             permission => permission.moduleName === moduleName && permission[action] === 1
//         );
//     };

//     const value = {
//         permissions,
//         hasPermission,
//         loading,
//         error
//     };

//     return (
//         <PermissionsContext.Provider value={value}>
//             {children}
//         </PermissionsContext.Provider>
//     );
// };
// export const usePermissions = () => {
//     const context = useContext(PermissionsContext);
//     if (!context) {
//         throw new Error('usePermissions must be used within a PermissionsProvider');
//     }
//     return context;
// };

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const PermissionsContext = createContext();
export const PermissionsProvider = ({ children }) => {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadRolePermissions = () => {
            try {
                const rolePermissionsCookie = Cookies.get('rolePermissions');
                
                if (!rolePermissionsCookie) {
                    setPermissions([]);
                    return;
                }
                const parsedPermissions = JSON.parse(rolePermissionsCookie);
                
                if (!Array.isArray(parsedPermissions)) {
                    throw new Error('Permissions data is not an array');
                } 
                // Set permissions state
                setPermissions(parsedPermissions);
            } catch (err) {
                console.error('Failed to load permissions:', err);
                setError(err);
                setPermissions([]);
                // Clear invalid cookie
                Cookies.remove('rolePermissions');
            } finally {
                setLoading(false);
            }
        };

        loadRolePermissions();
    }, []);
    // Function to set permissions and store them in cookies
    const setRolePermissions = (newPermissions) => {
        try {
            // Assuming newPermissions is an array of permission objects
            setPermissions(newPermissions);
            Cookies.set('rolePermissions', JSON.stringify(newPermissions), { expires: 7 }); // Set cookie to expire in 7 days
        } catch (err) {
            console.error('Failed to set permissions:', err);
        }
    };
    
    const hasPermission = (moduleName, action) => {
        if (error) return false;
        if (loading) return false; // Or your preferred loading behavior
        
        return permissions.some(
            permission => permission.moduleName === moduleName && permission[action] === 1
        );
    };

    const value = {
        permissions,
        hasPermission,
        loading,
        error,
        setRolePermissions // Expose the function to set permissions
    };

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
};

export const usePermissions = () => {
    const context = useContext(PermissionsContext);
    if (!context) {
        throw new Error('usePermissions must be used within a PermissionsProvider');
    }
    return context;
};
