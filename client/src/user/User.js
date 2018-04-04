import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UserActions from './UserActions';

// component part

// container part
function mapStateToProps(state) {
    return {...state};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        ...UserActions,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(User);