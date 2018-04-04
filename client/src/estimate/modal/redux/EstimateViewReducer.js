import {
    CHANGE_ESTIMATE_VIEW_MODAL
} from './EstimateViewConstants'

const initialState = {
    modal: {
        ProjectTimeModal   : false,
        SLOCModal          : false,
        ScaleFactorModal   : false,
        CostDriverModal    : false,
        SuitableStaffsModal: false,
        SummaryProjectModal: false
    }
};

export function estimateViewReducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_ESTIMATE_VIEW_MODAL:
            return {
                ...state,
                modal: action.newState
            };
        default:
            return state;
    }
}

