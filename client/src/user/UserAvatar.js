import React from 'react';
import {connect} from 'react-redux';
import { getUserInfo } from './UserActions';
import { Image } from 'semantic-ui-react';

class Avatar extends React.Component {
	componentWillMount() {
		this.props.getUserInfo();
	}
	render() {
		return (
			<span>
				<Image avatar src={this.props.data.profile.image} /> {this.props.data.profile.firstname} {this.props.data.profile.lastname}
		  	</span>
		);
	}
}


const mapStateToProps = (state) => {
    return {
		data: state.userReducer
	};
}

const mapDispatchToProps = {
    getUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Avatar);