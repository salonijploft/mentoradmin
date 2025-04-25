export const setPermissions = (permissions) => {
    return {
        type: 'SET_PERMISSIONS',
        payload: permissions,
    };
};