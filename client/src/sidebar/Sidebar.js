import React from 'react';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {
    Sidebar,
    Menu,
    Image,
    Icon,
    Header,
    Modal,
    Dropdown
} from 'semantic-ui-react';
import auth from '../utils/auth';
import ModalCompanyInfo from './ModalCompanyInfo';
import _ from 'lodash';
import {changeVisible} from './SidebarActions';

import Estimate from '../estimate/Estimate';

import project from '../utils/project';

import user from '../utils/user';

import {
  changeIdNewProjectForm,
  changeProjectSaved
} from '../project/ProjectActions'

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: sessionStorage.current_project || 'dashboard',
            projects: [],
            company: {},
            // visibleSidebar: this.props.sidebar.visibleSidebar
        }
        
    }

    // toggleVisibility = () => this.setState({ visibleSidebar: !this.state.visibleSidebar })
    // toggleVisibility = () => this.props.changeVisible(!this.props.sidebar.visibleSidebar)

    hideSidebar = () => this.props.sidebar.visibleSidebar ? this.props.changeVisible(false) : ''

    handleItemClick = name => {
        sessionStorage.current_project = name;
        this.setState({activeItem: name});
        this.hideSidebar();
    }

    componentWillMount() {
        user.getUserInfo().then(response => {
            if(response && response.success) {
                this.setState({
                    company: response.user.current_company,
                    projects: [...this.state.projects, ...response.user.belong_project]
                });
            } else {
                auth.logout();
                this.props.history.push('/');
            }
        });
        project.getProjectBelongUser().then(response => {
            if(response && response.success) {
                this.setState({
                    projects: [...this.state.projects, ...response.projects]
                });
            }
        });
    }    

    componentWillReceiveProps(nextProps) {
        if(nextProps.projectReducer.projectSaved !== undefined)
        {
            if(Object.keys(nextProps.projectReducer.projectSaved).length > 0){
                // console.log('nextProps.projectReducer.projectSaved.users',nextProps.projectReducer.projectSaved.users);
                // console.log('this.props.profileUser.profile._id',this.props.profileUser.profile._id);
                if(nextProps.projectReducer.projectSaved.users.indexOf(this.props.profileUser.profile._id) > -1)
                {
                    let projects = [...this.state.projects];

                    projects.push(nextProps.projectReducer.projectSaved);
                
                    this.setState({
                        projects: projects
                    });
                }
                this.props.changeProjectSaved({});
            }
        }
    }

    render() {
        const { activeItem } = this.state;
        const projects = _.uniqBy(this.state.projects, '_id');
        var trigger = (
            <Header style={{color: 'white', marginBottom: 0}} as='h1'> 
                <Image centered circular='true' size={'small'} style={{borderRadius: '50%'}} src={this.state.company.image} />
                {' '}{this.props.match.params.company}
            </Header>
        );
        return (
                <Sidebar
                    as={Menu}
                    animation='push'
                    visible={this.props.sidebar.visibleSidebar}
                    vertical
                    inverted
                    style={{
                        width: 260, paddingBottom: '1em', background: '#18222a'
                    }}
                    >
                    <Menu.Item>
                        <Dropdown style={{width: '100%'}} trigger={trigger} pointing='top left' icon={null} >
                            <Dropdown.Menu>
                                <Modal size={'small'} closeIcon trigger={<Dropdown.Item icon='address book' text='Thông tin công ty'/>} >
                                    <Modal.Header>
                                        <Header size='small' icon='hashtag' content='Thông tin công ty'/>
                                    </Modal.Header>
                                    <Modal.Content image scrolling>
                                        <ModalCompanyInfo company={this.state.company} />
                                    </Modal.Content>
                                </Modal>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Menu.Item>
                    {this.props.profileUser.profile.admin === 1 ? (
                        <div>
                            <Menu.Item style={{fontSize: 19, fontWeight: 'bold'}} 
                                        as={Link} 
                                        to={`${this.props.match.url}/dashboard`}
                                        name={'dashboard'}
                                        active={activeItem === 'dashboard'}
                                        onClick={this.handleItemClick.bind(this, 'dashboard')}>
                                        
                                    <Icon name='dashboard' style={{float: 'left', marginRight: 10, marginLeft: 10}} />Quản lý nhân viên   
                            </Menu.Item>
                            <Menu.Item style={{fontSize: 19, fontWeight: 'bold'}} 
                                    as={Link} 
                                    to={`${this.props.match.url}/allStaffTimeline`}
                                    name={'dashboard'}
                                    active={activeItem === 'allStaffTimeline'}
                                    onClick={this.handleItemClick.bind(this, 'allStaffTimeline')}>
                                    
                                <Icon name='clock' style={{float: 'left', marginRight: 10, marginLeft: 10}} />Thời gian làm việc   
                            </Menu.Item>
                        </div>
                    ) : ""}
                    <Menu.Item>
                        <Menu.Header>
                            <div style={{display: 'inline-block', fontSize: 19}}>Dự án</div>
                            <Estimate/>
                        </Menu.Header>

                        <Menu.Menu>
                            {projects.map(project => (
                                <Menu.Item 
                                    key={project._id}
                                    style={{fontSize: 15}}
                                    name={project.project_name}
                                    active={activeItem === project.project_name}
                                    onClick={this.handleItemClick.bind(this, project.project_name)}
                                    as={Link} to={`${this.props.match.url}/project/${project.project_name}?id=${project._id}`}> 
                                    <Icon name='rocket' style={{float: 'left', marginRight: 10}} /> {project.project_name}
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>
                            <div style={{display: 'inline-block', fontSize: 19}}>Lịch sử hoạt động</div>
                        </Menu.Header>

                        <Menu.Menu>
                            {projects.map(project => (
                                <Menu.Item 
                                    key={project._id}
                                    style={{fontSize: 15}}
                                    name={project.project_name + '_activity'}
                                    active={activeItem === project.project_name + '_activity'}
                                    onClick={this.handleItemClick.bind(this, project.project_name + '_activity')}
                                    as={Link} to={`${this.props.match.url}/activity/${project.project_name}?id=${project._id}`}> 
                                    <Icon name='rocket' style={{float: 'left', marginRight: 10}} /> {project.project_name}
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                    </Menu.Item>
                    <Menu.Item>
                        <Menu.Header>
                            <div style={{display: 'inline-block', fontSize: 19}}>Phòng họp</div>
                        </Menu.Header>

                        <Menu.Menu>
                            {projects.map(project => (
                                <Menu.Item 
                                    key={project._id}
                                    style={{fontSize: 15}}
                                    name={project.project_name + '_meeting'}
                                    active={activeItem === project.project_name + '_meeting'}
                                    onClick={this.handleItemClick.bind(this, project.project_name + '_meeting')}
                                    as={Link} to={`${this.props.match.url}/meeting/${project.project_name}?id=${project._id}`}> 
                                    <Icon name='rocket' style={{float: 'left', marginRight: 10}} /> {project.project_name}
                                </Menu.Item>
                            ))}
                        </Menu.Menu>
                    </Menu.Item>
                </Sidebar>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profileUser: state.userReducer,
        projectReducer: state.projectReducer,
        sidebar: state.sidebarReducer
    };
}
const mapDispatchToProps = {
    changeIdNewProjectForm,
    changeProjectSaved,
    changeVisible
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
