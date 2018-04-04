import { combineReducers } from 'redux';
import { authReducer } from '../auth/authReducer';
import { sidebarReducer } from '../sidebar/SidebarReducer';
import { userReducer } from '../user/userReducer';
import { socketReducer } from '../app/socket';
import { estimateReducer } from '../estimate/estimateReducer';
import { projectReducer } from '../project/projectReducer';
import { editorReducer } from '../editor/editorReducer';
import { estimateViewReducer } from '../estimate/modal/redux/EstimateViewReducer';
import { functionPointReducer } from '../estimate/function_point/FunctionPointReducer';

export default combineReducers({
    authReducer,
    userReducer,
    estimateReducer,
    projectReducer,
    sidebarReducer,
    socketReducer,
    editorReducer,
    estimateViewReducer,
    functionPointReducer
});