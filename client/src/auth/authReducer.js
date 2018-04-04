import {CHANGE_LOGIN_FORM, CHANGE_REGISTER_FORM, SET_AUTH, SENDING_REQUEST, SET_ERROR_MESSAGE} from './AuthConstants';
import auth from '../utils/auth';

const initialState = {
    formLoginState: {
        email: '',
        password: '',
        company_name: ''
    },
    formRegisterState: {
        company_name: '',
        email: '',
        username: '',
        password: '',
        confirm_password: ''
    },
    currentlySending: false,
    loggedIn: auth.loggedIn(),
    errorMessage: ''
};

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LOGIN_FORM:
            return {
                ...state,
                formLoginState: action.newState
            };
        case CHANGE_REGISTER_FORM:
            return {
                ...state,
                formRegisterState: action.newState
            };
        case SET_AUTH:
            return {
                ...state,
                loggedIn: action.newState
            };
        case SENDING_REQUEST:
            return {
                ...state,
                currentlySending: action.sending
            };
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.message
            };
        default:
            return state;
    }
}