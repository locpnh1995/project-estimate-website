import { 
	CHANGE_USERS_NEW_PROJECT_FORM,
	CHANGE_ID_NEW_PROJECT_FORM,
	CHANGE_PROJECT_SAVED,
	CHANGE_RESPONSIBLE_USER,
	CHANGE_PROJECT_WILL_CREATE,
	CHANGE_FIND_TEAM_BUGDET_ERROR,
	SET_ACCEPT_SUGGESTION_STATUS,
	SET_PROJECT_CREATED_STATUS,
	RESET_PROJECT_WILL_CREATE,
	CHANGE_CREATE_MODE,
	CHANGE_VISIBLE_CREATE_MODE_MODAL
} from './ProjectConstants'

export function changeUserNewProjectForm(newState) {
    return {type: CHANGE_USERS_NEW_PROJECT_FORM, newState};
}

export function changeIdNewProjectForm(newState) {
    return {type: CHANGE_ID_NEW_PROJECT_FORM, newState};
}

export function changeProjectSaved(newState) {
    return {type: CHANGE_PROJECT_SAVED, newState};
}

export function changeResponsibleUser(newState) {
    return {type: CHANGE_RESPONSIBLE_USER, newState};
}

export function changeProjectWillCreate(newState) {
    return {type: CHANGE_PROJECT_WILL_CREATE, newState};
}

export function changeFindTeamBugdetError(newState) {
    return {type: CHANGE_FIND_TEAM_BUGDET_ERROR, newState};
}

export function setAcceptSuggestionStatus(newState) {
    return {type: SET_ACCEPT_SUGGESTION_STATUS, newState};
}

export function setProjectCreatedStatus(newState) {
    return {type: SET_PROJECT_CREATED_STATUS, newState};
}

export function resetProjectWillCreate(newState) {
    return {type: RESET_PROJECT_WILL_CREATE, newState};
}

export function changeCreateMode(newState) {
    return {type: CHANGE_CREATE_MODE, newState};
}

export function changeVisibleCreateModeModal(newState) {
    return {type: CHANGE_VISIBLE_CREATE_MODE_MODAL, newState};
}
