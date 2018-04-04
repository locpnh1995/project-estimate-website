export function changeTaskEditorCode(taskID, newState, mode) {
    return {type: 'CHANGE_TASK_EDITOR_CODE', newState, taskID, mode};
}

export function changeTaskEditorMode(taskID, newState, mode) {
    return {type: 'CHANGE_TASK_EDITOR_MODE', newState, taskID, mode};
}

export function initTaskEditorCode(taskID, newState) {
    return {type: 'INIT_TASK_EDITOR_CODE', taskID, newState};
}

