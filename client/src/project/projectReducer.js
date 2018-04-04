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

import moment from 'moment';

const NOT_DECIDED = -1, ACCEPTED = 1, DECLINED = 0;

const CREATE_MODE_NOT_DECIDED = 0;
const MANUAL_PICK_STAFF = 1;
const AUTO_PICK_STAFF = 2;
const COMPLETELY_AUTO_PICK_STAFF = 3;
const PRE_PICK_STAFF = 4;

const initialState = {
	projectSaved:{

	},
    projectWillCreate:{
        project_name: '',
        budget: 0,
        level: 0,
        // start_day: new Date(),
        // end_day: new Date(),
        description: '',
        start_day: moment(),
        end_day: moment().add(3,'months'),
        duration: 0,
        language_programming: [],
        belong_company: 0,
        created_by: 0,
        users: [],
        tasks: []
    },
	responsible_user: [],
    findTeamBudgetError: false,
    acceptSuggestionStatus: NOT_DECIDED,
    isProjectCreated: false,
    createMode: CREATE_MODE_NOT_DECIDED,
    visibleCreateModeModal: false

	// _id :{
 //    	'project_id': 0,
 //    },
 //    users: {
 //    	'users': []	
 //    }
    // 'budget': 0,
    // 'deadline': new Date(),
    // 'description': '',
    // 'language_programming': [],
    // 'belong_company' : 0,
    // 'created_by' : 0,
    
};

export function projectReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_USERS_NEW_PROJECT_FORM:
            return {
                ...state,
                projectWillCreate: {...state.projectWillCreate, users: action.newState}
            };
        case CHANGE_ID_NEW_PROJECT_FORM:
            return {
                ...state,
                _id: action.newState
            };
        case CHANGE_PROJECT_SAVED:
            return {
                ...state,
                projectSaved: action.newState
            };
        case CHANGE_RESPONSIBLE_USER:
            return {
                ...state,
                responsible_user: action.newState
            };
        case CHANGE_PROJECT_WILL_CREATE:
            return {
                ...state,
                projectWillCreate: action.newState
            };
        case CHANGE_FIND_TEAM_BUGDET_ERROR:
            return {
                ...state,
                findTeamBudgetError: action.newState
            };
        case SET_ACCEPT_SUGGESTION_STATUS:
            return {
                ...state,
                acceptSuggestionStatus: action.newState
            };
        case SET_PROJECT_CREATED_STATUS:
            return {
                ...state,
                isProjectCreated: action.newState
            };
        case RESET_PROJECT_WILL_CREATE:
            return {
                ...state,
                projectWillCreate: {...initialState.projectWillCreate}
            };
        case CHANGE_CREATE_MODE:
            return {
                ...state,
                createMode: action.newState
            };
        case CHANGE_VISIBLE_CREATE_MODE_MODAL:
            return {
                ...state,
                visibleCreateModeModal: action.newState
            };
        default:
            return state;
    }
}

