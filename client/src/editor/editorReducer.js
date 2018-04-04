const initialState = {};

export function editorReducer(state = initialState, action) {
    switch (action.type) {
        case 'INIT_TASK_EDITOR_CODE':
            return {
                ...state,
                [action.taskID]: {...action.newState}
            };
        case 'CHANGE_TASK_EDITOR_CODE':
            return {
                ...state,
                [action.taskID]: {...state[action.taskID], [action.mode]: {...state[action.taskID][action.mode], code: action.newState }}
            };
        case 'CHANGE_TASK_EDITOR_MODE':
            return {
                ...state,
                [action.taskID]: {...state[action.taskID], [action.mode]: {...state[action.taskID][action.mode], mode: action.newState}}
            };
        default:
            return state;
    }
}