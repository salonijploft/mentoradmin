const initialState = {
    rolePermissions: {}
};

const permissionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_PERMISSIONS':
            return {
                ...state,
                rolePermissions: action.payload,
            };
        default:
            return state;
    }
};

export default permissionReducer;