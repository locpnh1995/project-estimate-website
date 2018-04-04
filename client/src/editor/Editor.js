import React from 'react';
import {Grid, Tab, Dimmer, Loader} from 'semantic-ui-react';
import CodeMirrorEditor from './CodemirrorEditor';
import LiveCode from './LiveCode';
import {connect} from 'react-redux';
import {initTaskEditorCode} from './EditorActions';
import axios from 'axios';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        }
        // this.receiveMode = this.receiveMode.bind(this);
        // this.receiveCode = this.receiveCode.bind(this);
        this.getTaskInfo = this.getTaskInfo.bind(this);
        //this.props.initTaskEditorCode(this.props.taskID, {html:{}, css:{}, js:{}});
        
    }
    async getTaskInfo() {
        var response = await axios.get(`/api/tasks/${this.props.taskID}`, {headers: { 'x-access-token': localStorage.token } });
        if(response.data.success) {
            var editor = response.data.task.editor;
            this.props.initTaskEditorCode(this.props.taskID, editor);
        } else {
            this.props.initTaskEditorCode(this.props.taskID, {html:{}, css:{}, js:{}});
        }  
        this.setState({
            loading: false
        });    
    }
    componentWillMount() {
        this.getTaskInfo();
    }
    // receiveMode(mode, prevMode) {
    //     var key = '';
    //     if (prevMode === this.state.modehtml) {
    //         key = 'modehtml';
    //     } else if (prevMode === this.state.modecss) {
    //         key = 'modecss';
    //     } else if (prevMode === this.state.modejs) {
    //         key = 'modejs';
    //     }
    //     this.setState({
    //         [key]: mode
    //     });
    // }

    // receiveCode(code, mode) {
    //     var key = '';
    //     if (mode === this.state.modehtml) {
    //         key = 'codehtml';
    //     } else if (mode === this.state.modecss) {
    //         key = 'codecss';
    //     } else if (mode === this.state.modejs) {
    //         key = 'codejs';
    //     }
    //     this.setState({
    //         [key]: code
    //     });
    // }

    // runCode() {

    // }

    render() {
        const panes = [
            {menuItem: 'HTML', render: () => <Tab.Pane style={{padding: 0}} key={1}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'html'} /></Tab.Pane>},
            {menuItem: 'CSS', render: () => <Tab.Pane style={{padding: 0}} key={2}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'css'} /></Tab.Pane>},
            {menuItem: 'JS', render: () => <Tab.Pane style={{padding: 0}} key={3}><CodeMirrorEditor taskID={this.props.taskID} modeInit={'js'} /></Tab.Pane>},
        ];
        return (
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        {this.state.loading ? (
                            <Dimmer active={true} inverted>
                                <Loader inverted>Đang tải</Loader>
                            </Dimmer>
                        ) : (
                            <Tab panes={panes} />
                        )}
                    </Grid.Column>
                    <Grid.Column>
                        <LiveCode
                            taskID={this.props.taskID} 
                        />
                    </Grid.Column>
                </Grid.Row>  
            </Grid>
        );
    }
}

const mapDispatchToProps = {
    initTaskEditorCode
};

export default connect(null, mapDispatchToProps)(Editor);