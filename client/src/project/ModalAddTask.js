import React from 'react';
import { Dropdown, Header, Icon, Modal, Button, Form } from 'semantic-ui-react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment-duration-format';

class ModalAddTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			openModalAdd: false,
			addTaskName: '',
			addLevel: '',
            addNote: '',
            addLabels: [],
            labelOptions: [],
			addDescription: '',
            addResponsible: '',
            addStartDay: moment(),
            addEndDay: moment().add(1, 'days'),
		};
        this.handleChangeAdd = this.handleChangeAdd.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    formatDropdownValue(arrayValue) {
        var formatValue = [];
        for (let value of arrayValue) {
            formatValue.push({ text: value, value });
        }
        return formatValue;
    }

    handleAddition(e, { name, value }) {
        console.log(name, value);
        let mapName = {
            addLabels: 'labelOptions'
        };
        this.setState({
            [ mapName[name] ]: [{ text: value, value }, ...this.state[ mapName[name] ]],
        });
    }

    handleDateChange(type, date) {
        console.log(date, type);
        this.setState({
			[type]: date
        });
    }

    closeModalAdd = () => {
		this.setState({ 
			openModalAdd: false,
			addTaskName: '',
			addLevel: '',
            addNote: '',
            addLabels: [],
			addDescription: '',
            addResponsible: '',
            addStartDay: moment(),
            addEndDay: moment().add(1, 'days'),
		});
	}
    openModalAdd = () => this.setState({ openModalAdd: true })
    
    handleChangeAdd(event, {name, value}) {
		this.setState({
			[name]: value
        });
	}

    render() {
        const { openModalAdd } = this.state; 
        return (
            <Modal open={openModalAdd} onClose={this.closeModalAdd} trigger={<div onClick={this.openModalAdd} style={{height: 60, width: 'auto', border: '3px dashed #999', lineHeight: '50px', borderRadius: 5, textAlign: 'center', color: '#999', cursor: 'pointer'}}><Icon name="add circle" size={'big'} /></div>} size='mini' closeIcon>
                <Header icon='hashtag' content='Thêm công việc'/>
                <Modal.Content>
                    <Form onSubmit={this.props.addTask.bind(this, this.state, 'TODO', this.closeModalAdd)}>
                        <Form.Field>
                            <Form.Input label="Tên công việc" placeholder='Tên công việc' name='addTaskName' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input type="number" label="Cấp độ" placeholder='Cấp độ' name='addLevel' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea label="Chú thích" placeholder='Chú thích' name='addNote' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field>
                            <Form.TextArea label="Mô tả" placeholder='Mô tả' name='addDescription' onChange={this.handleChangeAdd} required />
                        </Form.Field>
                        <Form.Field className="required">
                            <label>Ngày bắt đầu</label>
                            <DatePicker required selected={this.state.addStartDay}
                                name='addStartDay'
                                dateFormat="DD/MM/YYYY"
                                onChange={this.handleDateChange.bind(this, 'addStartDay')}
                            />
                        </Form.Field>
                        <Form.Field className="required">
                            <label>Ngày kết thúc</label>
                            <DatePicker required selected={this.state.addEndDay}
                                name='addEndDay'
                                dateFormat="DD/MM/YYYY"
                                onChange={this.handleDateChange.bind(this, 'addEndDay')}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Nhãn</label>
                            <Dropdown
                                name='addLabels'
                                options={this.state.labelOptions}
                                search
                                selection
                                fluid
                                multiple
                                allowAdditions
                                value={this.state.addLabels}
                                onAddItem={this.handleAddition}
                                onChange={this.handleChangeAdd}
                            />
                        </Form.Field>
                        <Form.Field>
                            <label>Người chịu trách nhiệm</label>
                            <Dropdown fluid multiple selection 
                                name='addResponsible'
                                options={this.props.formatResponsibleUser(this.props.currentProject.users)}
                                onChange={this.handleChangeAdd} />
                        </Form.Field>
                        <Button color='green' size='tiny' type='submit'>
                            <Icon name='checkmark'/>
                            Thêm
                        </Button>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default ModalAddTask;