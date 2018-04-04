import { UPDATE_PROFILE, UPDATE_LOADING } from './UserConstants';
import user from '../utils/user';
import auth from '../utils/auth';

export function getUserInfo() {
    return (dispatch) => {
        dispatch(setLoading(true));
        user.getUserInfo().then(response => {
            dispatch(setLoading(false));
            if(response.success) {
                dispatch(updateUserInfo(response.user));
                return response;
            }
            else {
                auth.logout();
            }
        });
    }
}

export function getUsersInCompanyInfo(company_id) {
    return (dispatch) => {

        return user.getUsersInCompanyInfo(company_id).then(response => {
            if(response !== undefined)
            {
                if (response.success) {

                    return response.users
                }
                else {
                    // dispatch(setErrorMessage(response.message));
                }
            }
            return response;
        });     
    }
}
export function setLoading(loading) {
    return {type: UPDATE_LOADING, loading};
}

export function updateUserInfo(newState) {
    return {type: UPDATE_PROFILE, newState};
}