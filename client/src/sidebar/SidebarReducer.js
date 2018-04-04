const initialState = {
    visibleSidebar: false
}

export function sidebarReducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_VISIBLE':
            return {
                ...state,
                visibleSidebar: action.visible
            };
        default:
            return state;
    }
}