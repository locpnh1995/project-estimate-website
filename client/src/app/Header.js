import React from 'react';
import { connect } from 'react-redux';
import { Menu, Segment, Dropdown, Icon, Modal, Header} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { logout } from '../auth/AuthActions';
import Avatar from '../user/UserAvatar';
import Profile from '../user/UserProfile';
import Notifications from '../notification/Notification';
import {changeVisible} from '../sidebar/SidebarActions';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this._logout = this._logout.bind(this);
    }

    
    _logout(e) {
        e.preventDefault();
        this.props.logout();
        this.props.history.push('/');
    }

    toggleVisibility = () => this.props.changeVisible(!this.props.sidebar.visibleSidebar)

    render() {
        var trigger = (
            <span>
                <Avatar />
            </span>
        )
        const NavRight = this.props.auth.loggedIn ? (
            <Menu.Menu position='right'>
                <Menu.Item style={{paddingLeft: 0, paddingRight: 0}}>
                    <Notifications {...this.props} />
                </Menu.Item>
                <Menu.Item style={{paddingTop: 3.5, paddingBottom: 3.5}}>
                    <Dropdown trigger={trigger} pointing='top right' icon={null} >
                        <Dropdown.Menu>
                            <Modal size={'small'} closeIcon trigger={<Dropdown.Item icon='address book' text='Thông tin cá nhân'/>} >
                                <Modal.Header>
                                    <Header size='small' icon='hashtag' content='Thông tin cá nhân'/>
                                </Modal.Header>
                                <Modal.Content image scrolling>
                                    <Profile />
                                </Modal.Content>
                            </Modal>
                            <Dropdown.Divider />
                            <Dropdown.Item icon='sign out' text='Đăng xuất' onClick={this._logout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu.Menu>
        ) : (
            <Menu.Menu position='right'>
                <Menu.Item name='signUp' as={Link} to={`/signup`} />
            </Menu.Menu>
        );

        return (
            <Segment style={{padding: '0.5em'}}>
                <Menu secondary stackable> 
                    <Menu.Item name='home'> 
                        <Icon name='sidebar' size='large' style={{cursor: 'pointer'}} onClick={this.toggleVisibility}/>
                    </Menu.Item>
                    { NavRight }
                </Menu>
            </Segment>
        )
      }
}

const mapStateToProps = (state) => {
    return {
        auth: state.authReducer,
        sidebar: state.sidebarReducer
    };
}

const mapDispatchToProps = {
    logout,
    changeVisible
};

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);