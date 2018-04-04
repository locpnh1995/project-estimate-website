import { UPDATE_PROFILE, UPDATE_LOADING } from './UserConstants';

const initialState = {
    profile: {
        email: '',
        username: '',
        image: '',
        lastname: '',
        firstname: '',
        language_programming: [],
        docker: [],
        level: '',
        time_available: '',
        studied_at: [],
        worked_at: [],
        current_company: '',
        description: '',
        experience: ''
    },
    loading: false,
};

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case UPDATE_PROFILE:
            return {
                ...state,
                profile: action.newState
            };
        case UPDATE_LOADING:
            return {
                ...state,
                loading: action.loading
            };
        default:
            return state;
    }
}