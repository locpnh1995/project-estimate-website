export function changeSocket(socket) {
    return {type: 'CHANGE_SOCKET', socket};
}

const initialState = {
    socket: ''
}

export function socketReducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_SOCKET':
            return {
                ...state,
                socket: action.socket
            };
        default:
            return state;
    }
}