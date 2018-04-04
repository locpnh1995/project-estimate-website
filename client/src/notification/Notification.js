import React from 'react';
import { connect } from 'react-redux';
import { Dropdown, Icon, Header, Item, Label, Loader } from 'semantic-ui-react';
import axios from 'axios';
import TimeAgo from 'react-timeago';

document.addEventListener('DOMContentLoaded', function () {
    if (Notification.permission !== "granted")
      Notification.requestPermission();
  });
  
function notifyMe(title, body, link, timeout = 10000, icon = 'https://freeiconshop.com/wp-content/uploads/edd/notification-flat.png') {
    if (!Notification) {
        alert('Desktop notifications not available in your browser. Try Chromium.'); 
        return;
    }
    if (Notification.permission !== "granted")
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: icon,
            body: body,
        });
        notification.onclick = function () {
            window.open("teamcode.tk" + link);      
        }; 
        setTimeout(notification.close.bind(notification), timeout);
    }
}

class Notifications extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            notificationList: [],
            newNotification: 0,
            offset: 0,
            limit: 15,
            activeLoader: false,
            blockRequest: false
        }

        this.getNotification = this.getNotification.bind(this);
        this.updateAllNotificationStatus = this.updateAllNotificationStatus.bind(this);
        this.handleCloseNotification = this.handleCloseNotification.bind(this);
        this.updateNotificationStatusAfterClick = this.updateNotificationStatusAfterClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.props.socket.on('Notification:updateNotification', (notificationItem) => {
            this.setState({
                notificationList: [notificationItem, ...this.state.notificationList],
                newNotification: this.state.newNotification + 1
            });
            let link = `/#/${this.props.match.params.company}/project/${notificationItem.link}`;
            notifyMe(notificationItem.title, notificationItem.content, link);
        });
    }

    componentDidMount() {
        axios
            .get('/api/notifications/status/0', {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                console.log(response);
                if(response && response.data.success) {
                    this.setState({
                        newNotification: response.data.notifications
                    });
                } 
            })
            .catch(error => {
                console.log(error);
            });
    }

    getNotification(e, data) {
        this.updateAllNotificationStatus(1);
        axios
            .get('/api/notifications/', {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                console.log(response);
                if(response && response.data.success) {
                    this.setState({
                        notificationList: response.data.notifications,
                        offset: this.state.offset + 15
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateAllNotificationStatus(status) {
        axios
            .put(`/api/notifications/status/${status}`, {}, {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                console.log(response);
                if(response && response.data.success) {
                    this.setState({
                        newNotification: response.data.notifications
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
    }

    updateNotificationStatusAfterClick(id, status, link) {
        axios
            .put(`/api/notifications/${id}/status/${status}`, {}, {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                console.log(response);
                if(response && response.data.success) {
                    this.setState({
                        newNotification: response.data.notifications
                    }); 
                }
                this.props.history.push(`/${this.props.match.params.company}/project/${link}`);
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleCloseNotification() {
        this.setState({
            notificationList: [],
            offset: 0,
            limit: 15,
            activeLoader: false,
            blockRequest: false
        });
    }

    handleScroll(event) {
        // console.log(event.currentTarget.scrollHeight);
        // console.log(event.currentTarget.scrollTop);
        if (event.currentTarget.scrollTop + 287 === event.currentTarget.scrollHeight && !this.state.blockRequest && !this.state.activeLoader) { // end of nitification, load more
            this.setState({
                activeLoader: true
            });
            axios
                .get(`/api/notifications/?offset=${this.state.offset}&limit=${this.state.limit}`, {headers: { 'x-access-token': localStorage.token } })
                .then(response => {
                    if(response && response.data.success && response.data.notifications.length !== 0) {
                        this.setState({
                            notificationList: [...this.state.notificationList, ...response.data.notifications],
                            offset: this.state.offset + 15,
                            activeLoader: false
                        });    
                    }
                    else {
                        this.setState({
                            blockRequest: true,
                            activeLoader: false
                        });
                    }
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
        const trigger = (
            <div>
                <Icon name='alarm outline' />
                {(this.state.newNotification > 0) ? (
                    <Label color='red' circular size='mini' floating>
                        {this.state.newNotification}
                    </Label>
                ) : '' }
                
            </div>
        );
        return (
            <Dropdown trigger={trigger} pointing='top right' inline icon={null} onOpen={this.getNotification} onClose={this.handleCloseNotification}>
                <Dropdown.Menu style={{minWidth: 400, right: -7.5}}>
                    <Dropdown.Header>Thông báo</Dropdown.Header>
                    <Dropdown.Menu scrolling onScroll={this.handleScroll}>
                        {(this.state.notificationList.length > 0) ? (
                            this.state.notificationList.map((notification) => (
                                <Dropdown.Item 
                                    key={notification._id} 
                                    className={notification.status === 2 ? 'seen' : 'noseen'}
                                    onClick={this.updateNotificationStatusAfterClick.bind(this, notification._id, 2, notification.link)}> 
                                    <Item.Group>
                                        <Item style={{padding: 0}}>
                                            <Item.Content>
                                                <Item.Header as='h5'><Icon name='hashtag' />{notification.title}</Item.Header>
                                                <Item.Description style={{fontSize: 15}}>
                                                    {notification.content}
                                                </Item.Description>
                                                <Item.Extra><Icon name='time' /><TimeAgo date={notification.createdAt} /></Item.Extra>
                                            </Item.Content>
                                        </Item>
                                    </Item.Group>
                                </Dropdown.Item>
                            ))  
                        ) : (
                            <Dropdown.Item> 
                                <Header as='h3' textAlign='center' content='Trống' />
                            </Dropdown.Item> 
                        )}
                        {this.state.activeLoader ? (
                            <Dropdown.Item style={{marginBottom: 5}}>
                                <Loader size='small' active={this.state.activeLoader}></Loader>
                            </Dropdown.Item> 
                        )
                        : ''}                      
                    </Dropdown.Menu>
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

const mapStateToProps = (state) => {
    return {
		socket: state.socketReducer.socket
	};
}

export default connect(mapStateToProps)(Notifications);