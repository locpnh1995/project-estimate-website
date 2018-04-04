import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import { Sidebar, Segment, Form, Comment, Header, Button, Ref, Input } from 'semantic-ui-react';
import meeting from '../utils/meeting';
import TimeAgo from 'react-timeago';
import EmojiPopup from './EmojiPopup';
import twemoji from 'twemoji';

class Meeting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            room: 'general',
            peers: [],
            pureStream: '',
            stream: '',
            error: '',
            messages: [],
            projectId: '',
            containerMessageRef: '',
            limit: 30,
            offset: 0,
            blockRequest: false,
            visibleSidebar: false,
            micStatus: true,
            videoStatus: true,
            inputText: ''
        }
        this.textInput = '';
        this.room = '';
        this.initMeeting = this.initMeeting.bind(this);
        this.leaveMeeting = this.leaveMeeting.bind(this);
        this.onUnload = this.onUnload.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.loadMessage = this.loadMessage.bind(this);
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.handleClickEmoji = this.handleClickEmoji.bind(this);
    }

    initMeeting(currentRoom) {
        this.room = new window.meeting('');

        this.room.onLocalVideo((s) => {
            console.log('onLocalVideo: ', s);
            var stream = URL.createObjectURL(s);
            console.log("stream", stream);
            this.setState({
                pureStream: s,
                stream: stream
            });
        });
        this.room.onRemoteVideo((stream, participantID) => {
            this.setState({
                peers: [
                    ...this.state.peers, 
                    {
                        id: participantID,
                        stream: URL.createObjectURL(stream),
                        pureStream: stream
                    }
                ]
            });
            console.log('onRemoteVideo: ', stream, participantID);
        });
        this.room.onParticipantHangup((participantID) => {
            var peers = this.state.peers.filter((p) => {
                return p.id !== participantID;
            });
            console.log(participantID);
            console.log(this.state.peers);
            console.log(peers);
            this.setState({
                peers: peers
            });
            console.log('disconnect: ', participantID);
        });
        this.room.onChatReady(() => {
            console.log('Chat is ready');
        });

        this.room.onReceiveMessage((message) => {
            this.setState({
                messages: [...this.state.messages, message]
            }, () => {
                twemoji.parse(ReactDOM.findDOMNode(this));
                console.log(this.state.containerMessageRef.scrollTop ,this.state.containerMessageRef.offsetHeight, this.state.containerMessageRef.scrollHeight)
                if (this.state.containerMessageRef.scrollHeight - (this.state.containerMessageRef.scrollTop + this.state.containerMessageRef.offsetHeight) > 49) {
                    this.scrollToBottom();
                }
            });
        });

        this.room.joinRoom(currentRoom);
    }

    leaveMeeting(callback) {
        if(this.room) {
            this.room.stateUnmount();
            this.room = '';
        }
        if(this.state.pureStream) {
            this.state.pureStream.getTracks().forEach(track => track.stop());
        }
        if(this.state.peers.length > 0) {
            this.state.peers.map(peer => {
                peer.pureStream.getTracks().forEach(track => track.stop());
            });
        }
        this.setState({
            room: 'general',
            peers: [],
            pureStream: '',
            stream: '',
            error: '',
        }, callback);
    }

    toggleVideo = () => {
        this.room.toggleVideo();
        this.setState({
            videoStatus: !this.state.videoStatus
        });
    }
    toggleMic = () => {
        this.room.toggleMic();
        this.setState({
            micStatus: !this.state.micStatus
        });
    }

    toggleVisibility = () => this.setState({ visibleSidebar: !this.state.visibleSidebar })

    getQueryParams(paramsString, param) {
		let params = new URLSearchParams(paramsString); 
		let value = params.get(param);
		return value;
	}

    componentWillMount() {
        console.log(this.props);
        var projectId = this.getQueryParams(this.props.location.search, 'id');
        this.loadMessage(projectId);
        this.setState({
            projectId: projectId
        });
        this.initMeeting(this.props.match.url);
    }

    componentWillReceiveProps(nextProps) {
        console.log(this.props.match.params.project);
        console.log(nextProps.match.params.project, '====================');
        console.log(this.room, 'room------------------')
        if(this.props.match.params.project !== nextProps.match.params.project) {
            var projectId = this.getQueryParams(nextProps.location.search, 'id');
            this.setState({
                projectId: projectId,
                messages: [],
                limit: 30,
                offset: 0,
                visibleSidebar: false
            }, () => {
                this.loadMessage(projectId);
            });
            this.leaveMeeting(() => {
                this.initMeeting(nextProps.match.url);
            });
            
        }
    }

    sendMessage(e) {
        // var message = e.target.elements.text_input.value;
        var message = this.state.inputText;
        if (message) {
            this.room.sendChatGroupMessage(this.props.profileUser.profile._id, this.state.projectId, message);
            // e.target.elements.text_input.value = '';
            this.setState({
                inputText: ''
            });
        }
    }

    loadMessage(projectId) {
        meeting
            .getMessage(projectId, this.state.limit, this.state.offset)
            .then((response) => {
                if(response.success && response.messages.length !== 0) {
                    console.log(response.messages);
                    this.setState({
                        messages: [...response.messages.reverse(), ...this.state.messages],
                        offset: this.state.offset + 30
                    }, () => {
                        if (this.state.offset === 30) {
                            this.scrollToBottom();
                        }
                        twemoji.parse(ReactDOM.findDOMNode(this));
                    });
                } else {
                    this.setState({
                        blockRequest: true
                    });
                    twemoji.parse(ReactDOM.findDOMNode(this));
                } 
            });
    }

    onUnload(e) {
        this.leaveMeeting();
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.onUnload);
    }

    componentWillUnmount() {
        console.log('unmount~~~~~~~~~');
        this.leaveMeeting();
        window.removeEventListener('beforeunload', this.onUnload);
    }

    handleRef = node => this.setState({ containerMessageRef: node })

    scrollToBottom = () => {
        if(this.state.containerMessageRef) {
            this.state.containerMessageRef.scrollTo(0, this.state.containerMessageRef.scrollHeight);
        }
    }
    handleScroll = (event) => {
        if(event.currentTarget.scrollTop === 0 && !this.state.blockRequest) {
            this.loadMessage(this.state.projectId);
        }
    }

    handleClickEmoji(emoji) {
        // console.log(emoji);
        this.setState({
            inputText: this.state.inputText + emoji
        });
    }

    handleChangeInput(e, {name, value}) {
        this.setState({
            inputText: value
        });
    }

    render() {
        // console.log(this.state);
        return (
            <Sidebar.Pushable key={'chat'} style={{marginTop:'-1rem', height: 'calc(100vh - 59px)'}}>
                <Sidebar style={{overflow: 'hidden'}} animation='overlay' width='wide' animation='overlay' direction='right' visible={this.state.visibleSidebar} icon='labeled' vertical='true'>
                    <Header as='h3' attached='top'>Tin nhắn</Header>
                    <Ref innerRef={this.handleRef}>
                        <Segment attached style={{height: 'calc(100% - 101px)', overflow: 'auto'}} onScroll={this.handleScroll}>
                            <Comment.Group>
                                {this.state.messages.map((message) => (
                                    <Comment key={message._id}>
                                        <Comment.Avatar src={message.from.image} />
                                        <Comment.Content>
                                            <Comment.Author as='a'>{message.from.firstname} {message.from.lastname}</Comment.Author>
                                            <Comment.Metadata>
                                                <TimeAgo date={message.createdAt} />
                                            </Comment.Metadata>
                                            <Comment.Text>
                                                {message.message}
                                            </Comment.Text>
                                        </Comment.Content>
                                    </Comment>
                                ))}
                            </Comment.Group>
                        </Segment>
                    </Ref>
                    <Header as='div' attached='bottom' style={{padding: 0, border: 'none'}}>
                        <Form onSubmit={this.sendMessage}>
                            <Form.Field>
                                <Input className='inputChat' type='text' placeholder='Nhập tin nhắn' value={this.state.inputText} name='text_input' size='small' onChange={this.handleChangeInput} action={<Button type='submit' content='Gửi' primary />} />
                                <EmojiPopup handleClickEmoji={this.handleClickEmoji} />
                            </Form.Field>
                        </Form>
                    </Header>
                </Sidebar>
                <Sidebar.Pusher className='video-meeting'>
                        <div className='navbar-meeting'>
                            {this.state.videoStatus ? (
                                <Button inverted basic icon='video camera' size='large' onClick={this.toggleVideo}></Button>
                            ) : (
                                <Button inverted basic icon='low vision' size='large' onClick={this.toggleVideo}></Button>
                            )}
                            {this.state.micStatus ? (
                                <Button inverted basic icon='unmute' size='large' onClick={this.toggleMic}></Button>
                            ) : (
                                <Button inverted basic icon='mute' size='large' onClick={this.toggleMic}></Button>
                            )}
                            <Button inverted basic icon='comments' size='large' onClick={this.toggleVisibility}></Button>
                        </div>
                        {this.state.videoStatus ? (
                            <video src={this.state.stream} autoPlay muted style={{width: '100%', height: 'inherit', background: '#000'}}></video>
                        ) : (
                            <img style={{width: '100%', height: '100%'}} src={this.props.profileUser.profile.image} />
                        )}
                        {this.state.peers.map((peer, index) => (
                            <video key={peer.id} src={peer.stream} autoPlay style={{width: '20%', position: 'absolute', bottom: 0, right: index * 200}}></video>
                        ))}
                
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}
const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer
	};
}

export default connect(mapStateToProps)(Meeting);
//export default Meeting;