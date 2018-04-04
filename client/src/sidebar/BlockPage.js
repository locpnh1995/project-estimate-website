import React from 'react';
import {connect} from 'react-redux';
import { Dimmer } from 'semantic-ui-react';
import { changeVisible } from './SidebarActions';

class BlockPage extends React.Component {
    constructor(props) {
        super(props);
    }

    hideSidebar = () => this.props.changeVisible(false)

    render() {
        return (
            <Dimmer active={this.props.sidebar.visibleSidebar} inverted onClick={this.hideSidebar} />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        sidebar: state.sidebarReducer
    };
}

const mapDispatchToProps = {
    changeVisible
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockPage);