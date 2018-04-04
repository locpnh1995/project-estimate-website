import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Sidebar } from 'semantic-ui-react';
import Dashboard from '../dashboard/Dashboard';
import Project from '../project/Project';
import NavBar from '../app/Header';
import Activity from '../activity/Activity';
import SideBar from './Sidebar';
import BlockPage from './BlockPage';
import Meeting from '../meeting/Meeting';
import AllStaffTimeline from '../timeline/AllStaffTimeline'

class SideBarContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Sidebar.Pushable>
                <SideBar {...this.props} />
                <Sidebar.Pusher>
                    <NavBar {...this.props} />
                    <div>
                        <BlockPage />
                        {/* <Redirect from={`${this.props.match.url}/`} to={`${this.props.match.url}/dashboard`}/> */}
                        <Switch>
                            <Route path={`${this.props.match.url}/dashboard`} component={Dashboard} />
                            <Route path={`${this.props.match.url}/allStaffTimeline`} component={AllStaffTimeline} />
                            <Route path={`${this.props.match.url}/project/:project`} component={Project} />
                            <Route path={`${this.props.match.url}/activity/:project`} component={Activity} />
                            <Route path={`${this.props.match.url}/meeting/:project`} component={Meeting} />
                        </Switch>
                    </div>
                </Sidebar.Pusher>
            </Sidebar.Pushable>
        )
    }
}

export default SideBarContainer;