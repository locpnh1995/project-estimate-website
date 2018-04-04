import {
    CHANGE_ESTIMATE_VIEW_MODAL
} from './EstimateViewConstants'

export function changeEstimateViewModal(newState) {
    return {type: CHANGE_ESTIMATE_VIEW_MODAL, newState};
}