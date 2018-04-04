import {
    CHANGE_VISIBLE_STATE,
    CHANGE_VALUE_STATE,
    CHANGE_FP_TABLE_ARRAY,
    SET_FUNCTION_POINT_DONE
} from './FunctionPointConstants'


const initialState = {
    visible:{
        numberOfProgrammingLanguages: true,
        numberOfProgrammingLanguagesErrorLabel: false
    },
    value:{
        numberOfProgrammingLanguages: 0
    },
    functionPointTableArray:{
        value: [],
        currentIndex: -1   
    },
    isFunctionPointDone: false
};

export function functionPointReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_VISIBLE_STATE:
            return {
                ...state,
                visible: action.newState
            };
        case CHANGE_VALUE_STATE:
            return {
                ...state,
                value: action.newState
            };
        case CHANGE_FP_TABLE_ARRAY:
            return {
                ...state,
                functionPointTableArray: action.newState
            };
        case SET_FUNCTION_POINT_DONE:
            return {
                ...state,
                isFunctionPointDone: action.newState
            };
        default:
            return state;
    }
}

