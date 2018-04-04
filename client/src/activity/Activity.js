import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Dimmer, Loader, Segment, Header } from 'semantic-ui-react';
import Timeline from 'react-time-line';
// import {Doughnut, Line} from 'react-chartjs-2';
import auth from '../utils/auth';

class Activity extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeLoading: true,
            activitiesLog: [],
            offset: 0,
            limit: 30,
            activeLoader: true,
            blockRequest: false,
            projectId: ''
        };
        this.handleScroll = this.handleScroll.bind(this);
        this.props.socket.on('Activity:updateActivity', (response) => {
			console.log(response);
            this.setState({
                activitiesLog: [response, ...this.state.activitiesLog]
            });
		});
    }

    formatActivities = (activities) => {
        var data = activities.map(activity => ({
            ts: activity.createdAt,
            text: activity.action
        }));
        return data;
    }

    getQueryParams(paramsString, param) {
		let params = new URLSearchParams(paramsString); 
		let value = params.get(param);
		return value;
	}

    componentWillMount() {
        this.props.socket.emit('Task:joinRoom', this.props.match.url);
        var projectId = this.getQueryParams(this.props.location.search, 'id');
        axios.get('/api/activities/projects/' + projectId, {headers: { 'x-access-token': localStorage.token } })
            .then(response => {
                console.log(response);
                if(response.data.success) {
                    this.setState({
                        activitiesLog: response.data.activities,
                        offset: this.state.offset + 30,
                        activeLoading: false,
                        activeLoader: false,
                        projectId: projectId
                    });
                } else {
                    auth.logout();
                    this.props.history.push('/');
                }
            })
            .catch(error => {
                console.log(error);
            });
        if(this.props.profileUser.profile._id) {
            this.props.socket.emit('updateOnlineList', this.props.profileUser.profile._id);
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        if (this.props.match.params.project !== nextProps.match.params.project) {
			this.setState({
                activeLoading: true,
                activitiesLog: [],
                offset: 0,
                limit: 30,
                activeLoader: true,
                blockRequest: false
			});
            this.props.socket.emit('Task:joinRoom', nextProps.match.url);
            var projectId = this.getQueryParams(nextProps.location.search, 'id');
			axios.get('/api/activities/projects/' + projectId, {headers: { 'x-access-token': localStorage.token } })
				.then(response => {
					this.setState({
                        activitiesLog: response.data.activities,
                        offset: this.state.offset + 30,
                        activeLoading: false,
                        activeLoader: false,
                        projectId: projectId
					});
				})
				.catch(error => {
					console.log(error);
				});	
		}
		if(nextProps.profileUser.profile._id){
			this.props.socket.emit('updateOnlineList', nextProps.profileUser.profile._id);
		}
    }

    handleScroll(event) {
        if (event.currentTarget.scrollTop + 300 === event.currentTarget.scrollHeight && !this.state.blockRequest && !this.state.activeLoader) { // end of nitification, load more
            this.setState({
                activeLoader: true
            });
            axios
                .get(`/api/activities/projects/${this.state.projectId}?offset=${this.state.offset}&limit=${this.state.limit}`, {headers: { 'x-access-token': localStorage.token } })
                .then(response => {
                    if(response.data.success && response.data.activities.length !== 0) {
                        this.setState({
                            activitiesLog: [...this.state.activitiesLog, ...response.data.activities],
                            offset: this.state.offset + 30,
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

    rand(min, max, num) {
        var rtn = [];
        while (rtn.length < num) {
          rtn.push((Math.random() * (max - min)) + min);
        }
        return rtn;
      }

    render() {
        // const chartDataLine = {
        //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //     datasets: [
        //         {
        //             label: 'Activity',
        //             fill: false,
        //             lineTension: 0.1,
        //             backgroundColor: 'rgba(75,192,192,0.4)',
        //             borderColor: 'rgba(75,192,192,1)',
        //             borderCapStyle: 'butt',
        //             borderDash: [],
        //             borderDashOffset: 0.0,
        //             borderJoinStyle: 'miter',
        //             pointBorderColor: 'rgba(75,192,192,1)',
        //             pointBackgroundColor: '#fff',
        //             pointBorderWidth: 1,
        //             pointHoverRadius: 5,
        //             pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        //             pointHoverBorderColor: 'rgba(220,220,220,1)',
        //             pointHoverBorderWidth: 2,
        //             pointRadius: 1,
        //             pointHitRadius: 10,
        //             data: [65, 59, 80, 81, 56, 55, 40]
        //         }
        //     ]
        // }
        // const lineOptions = {
        //     legend: {
        //         display: true,
        //         position: 'top'
        //     },
        //     title: {
        //         display: true,
        //         text: 'Project 1',
        //         fontSize: 20
        //     },
        //     responsive: true,
        //     maintainAspectRatio: false
        // }

        // const chartDataDoughnut = {
        //     labels: ["To Do", "In Progress", "Code Review", "Done"],
        //     datasets: [
        //         {
        //             label: "My First dataset",
        //             backgroundColor: ['rgb(181, 204, 24)', 'rgb(33, 133, 208)', 'rgb(219, 40, 40)', 'rgb(33, 186, 69)'],
        //             data: this.rand(32, 100, 4)
        //         }
        //     ]
        // }
        // const doughnutOptions = {
        //     legend: {
        //         display: true,
        //         position: 'left'
        //     },
        //     title: {
        //         display: true,
        //         text: 'Project 1',
        //         fontSize: 20
        //     }
        // }
        return (
            <div style={{width: '100%', height: 'calc(100vh - 59px)', overflow: 'auto', marginTop: '-1rem', fontSize: 18}}>
                <Dimmer active={this.state.activeLoading} inverted>
                    <Loader inverted>Đang tải</Loader>
                </Dimmer>
                <div style={{width: '100%', bottom: 0, position: 'absolute'}}>
                    <Header attached='top' size='medium'>Lịch sử hoạt động</Header>
                    <Segment loading={this.state.activeLoader} attached style={{height: 300, overflow: 'auto', padding: 0, paddingTop: 10}} onScroll={this.handleScroll}>
                        <Timeline items={this.formatActivities(this.state.activitiesLog)} />
                    </Segment>
                </div>
                
                {/* <Grid.Row >
                    <Grid.Column onScroll={this.handleScroll} style={{bottom: 0, position: 'absolute', width: '100%', height: 300, overflow: 'auto'}}>
                        <Segment>
                            <Timeline items={this.state.activitiesLog} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row> */}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer,
		socket: state.socketReducer.socket
	};
}

export default connect(mapStateToProps)(Activity);