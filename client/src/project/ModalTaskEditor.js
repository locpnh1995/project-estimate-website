import React from 'react';
import Editor from '../editor/Editor';

class ModalTaskEditor extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Editor taskID={this.props.taskID} />
        );
    }
}

export default ModalTaskEditor;