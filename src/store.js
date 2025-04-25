import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'; // Import thunk middleware
import permissionReducer from '../src/reducers/permissionReducer';

const rootReducer = combineReducers({
    permissions: permissionReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk)); // Apply middleware

export default store;