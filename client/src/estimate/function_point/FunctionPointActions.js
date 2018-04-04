import { 
	CHANGE_VISIBLE_STATE,
	CHANGE_VALUE_STATE,
	CHANGE_FP_TABLE_ARRAY,
	SET_FUNCTION_POINT_DONE
} from './FunctionPointConstants'

export function changeVisibleState(newState) {
    return {type: CHANGE_VISIBLE_STATE, newState};
}

export function changeValueState(newState) {
    return {type: CHANGE_VALUE_STATE, newState};
}

export function changeFPTableArray(newState){
	return {type: CHANGE_FP_TABLE_ARRAY, newState};	
}

export function setFunctionPointDone(newState){
	return {type: SET_FUNCTION_POINT_DONE, newState};	
}