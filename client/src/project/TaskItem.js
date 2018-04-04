import React from 'react';
import {
    Dropdown,
    Icon,
    Header,
    Container,
    Label,
    Image,
    Button,
    Modal,
    Form,
    Table,
    Divider,
    Popup,
    List
} from 'semantic-ui-react';
import TimeAgo from 'react-timeago';
import ModalTaskEditor from './ModalTaskEditor';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import 'moment-duration-format';

class TaskItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openModalEdit: false,
            openModalEditor: false,
            openModalDelete: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
			editNote: this.props.data.note,
            editDescription: this.props.data.description,
            editLabels: this.props.data.labels,
            labelOptions: this.formatDropdownValue(this.props.data.labels),
            editResponsible: this.props.data.responsible_user.map(user => user._id),
            editStartDay: moment(this.props.data.start_day),
            editEndDay: moment(this.props.data.end_day),
        }
        this.handleChangeEdit = this.handleChangeEdit.bind(this);
        this.handleAdditionEdit = this.handleAdditionEdit.bind(this);
        this.editTask = this.editTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    formatDate(dateValue) {
        var monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];
        var date = new Date(dateValue);
        var day = (date.getDate() < 10)
            ? '0' + date.getDate()
            : date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        var hours = (date.getHours() < 10)
            ? '0' + date.getHours()
            : date.getHours();
        var minutes = (date.getMinutes() < 10)
            ? '0' + date.getMinutes()
            : date.getMinutes();
        var seconds = (date.getSeconds() < 10)
            ? '0' + date.getSeconds()
            : date.getSeconds();
        return `${monthNames[monthIndex]} ${day} ${year} ${hours}:${minutes}:${seconds}`;
    }

    formatDropdownValue(arrayValue) {
        var formatValue = [];
        for (let value of arrayValue) {
            formatValue.push({ text: value, value });
        }
        return formatValue;
    }

    handleChangeEdit(event, {name, value}) {
        this.setState({
			[name]: value
        });
    }

    handleDateChange(type, date) {
        console.log(date, type);
        this.setState({
			[type]: date
        });
    }

    handleAdditionEdit(e, { name, value }) {
        console.log(name, value);
        let mapName = {
            editLabels: 'labelOptions'
        };
        this.setState({
            [ mapName[name] ]: [{ text: value, value }, ...this.state[ mapName[name] ]],
        });
    }
    
    closeModalEdit = () => {
		this.setState({ 
			openModalEdit: false,
            editTaskName: this.props.data.task_name,
			editLevel: this.props.data.level,
            editNote: this.props.data.note,
            editLabels: this.props.data.labels,
            labelOptions: this.formatDropdownValue(this.props.data.labels),
			editDescription: this.props.data.description,
            editResponsible: this.props.data.responsible_user.map(user => user._id),
            editStartDay: moment(this.props.data.start_day),
            editEndDay: moment(this.props.data.end_day),
        });
	}
	openModalEdit = () => this.setState({ openModalEdit: true })

    editTask() {
        this.props.editTask({ ...this.state, _id: this.props.data._id });
        this.closeModalEdit();
	}

    closeModalDelete = () => this.setState({ openModalDelete: false })
    openModalDelete = () => this.setState({ openModalDelete: true })

    closeModalEditor = () => this.setState({ openModalEditor: false })
    openModalEditor = () => this.setState({ openModalEditor: true })

    deleteTask() {
        this.props.deleteTask({ _id: this.props.data._id });
        this.closeModalDelete();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            editTaskName: nextProps.data.task_name,
			editLevel: nextProps.data.level,
			editNote: nextProps.data.note,
            editDescription: nextProps.data.description,
            editLabels: nextProps.data.labels,
            labelOptions: this.formatDropdownValue(nextProps.data.labels),
            editResponsible: nextProps.data.responsible_user.map(user => user._id),
            editStartDay: moment(nextProps.data.start_day),
            editEndDay: moment(nextProps.data.end_day),
        });
    }

    render() {
        const { openModalEdit, openModalDelete, openModalEditor } = this.state;
        let nameResponseUser = this.props.data.responsible_user.map(user => user.firstname + ' ' + user.lastname);
        if (nameResponseUser.length === 1) {
            nameResponseUser.join();
        }
        else {
            nameResponseUser = 'Multiple users';
        }
        return (
            <div style={{position: 'relative'}}>
                <Dropdown style={{position: 'absolute', top: -3, right: -5}} trigger={<Icon size='large' name="ellipsis vertical" />} icon={null}>
                    <Dropdown.Menu>
                        <Modal trigger={<Dropdown.Item icon='info circle' text = 'Chi tiết' />} size='mini' closeIcon>
                            <Header icon='hashtag' content='Chi tiết công việc'/>
                            <Modal.Content>
                                <Table basic='very'>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Tên công việc</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.task_name}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Trạng thái</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.status}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Cấp độ</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.level}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Chú thích</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.note}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Nhãn</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.labels.join(', ')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Mô tả</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.data.description}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Ngày bắt đầu</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.formatDate(this.props.data.start_day)}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Ngày kết thúc</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.formatDate(this.props.data.end_day)}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Tạo bởi</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Label as='a' image size='small'>
                                                    <img alt={this.props.data.created_by.email} src={this.props.data.created_by.image}/> {this.props.data.created_by.email}
                                                </Label>
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Người chịu trách nhiệm</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this
                                                    .props
                                                    .data
                                                    .responsible_user
                                                    .map(user => (
                                                        <Label key={user._id} as='a' image size='tiny'>
                                                            <img alt={user.email} src={user.image}/> {user.email}
                                                        </Label>
                                                    ))}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Thời gian tạo</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.formatDate(this.props.data.createdAt)}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Thời gian cập nhật</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.formatDate(this.props.data.updatedAt)}
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Modal.Content>
                        </Modal>
                        <Modal open={openModalEdit} onClose={this.closeModalEdit} trigger={<Dropdown.Item icon='edit' onClick={this.openModalEdit} text = 'Chỉnh sửa' />} size='mini' closeIcon>
                            <Header icon='hashtag' content='Chỉnh sửa công việc'/>
                            <Modal.Content>
                                <Form onSubmit={this.editTask}>
                                    <Form.Field>
                                        <Form.Input label="Tên công việc" placeholder='Tên công việc' name='editTaskName' value={this.state.editTaskName} onChange={this.handleChangeEdit} required />
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.Input type="number" label="Cấp độ"  placeholder='Cấp độ' name='editLevel' value={this.state.editLevel} onChange={this.handleChangeEdit} required />
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.TextArea label="Chú thích" placeholder='Chú thích' name='editNote' value={this.state.editNote} onChange={this.handleChangeEdit} required />
                                    </Form.Field>
                                    <Form.Field>
                                        <Form.TextArea label="Mô tả" placeholder='Mô tả' name='editDescription' value={this.state.editDescription} onChange={this.handleChangeEdit} required />
                                    </Form.Field>
                                    <Form.Field className="required">
                                        <label>Ngày bắt đầu</label>
                                        <DatePicker required selected={this.state.editStartDay}
                                            name='editStartDay'
                                            dateFormat="DD/MM/YYYY"
                                            onChange={this.handleDateChange.bind(this, 'editStartDay')}
                                        />
                                    </Form.Field>
                                    <Form.Field className="required">
                                        <label>Ngày kết thúc</label>
                                        <DatePicker required selected={this.state.editEndDay}
                                            name='editEndDay'
                                            dateFormat="DD/MM/YYYY"
                                            onChange={this.handleDateChange.bind(this, 'editEndDay')}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Nhãn</label>
                                        <Dropdown
                                            name='editLabels'
                                            options={this.state.labelOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.editLabels}
                                            onAddItem={this.handleAdditionEdit}
                                            onChange={this.handleChangeEdit}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label>Người chịu trách nhiệm</label>
                                        <Dropdown fluid multiple selection 
                                            value={this.state.editResponsible}
                                            name='editResponsible'
                                            options={this.props.formatResponsibleUser(this.props.users)}
                                            onChange={this.handleChangeEdit} />
                                    </Form.Field>
                                    <Button color='green' size='tiny' type='submit'>
                                        <Icon name='checkmark'/>
                                        Cập nhật
                                    </Button>
                                </Form>
                            </Modal.Content>
                        </Modal>
                        <Modal open={openModalDelete} onClose={this.closeModalDelete} trigger={<Dropdown.Item icon='trash outline' onClick={this.openModalDelete} text = 'Xóa' />} size='mini' closeIcon>
                            <Header icon='hashtag' content='Xóa công việc'/>
                            <Modal.Content>
                                <h4>Bạn có chắc muốn xóa công việc này ?</h4>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color='red' size='tiny' onClick={this.closeModalDelete}>
                                    <Icon name='remove'/>
                                    Không
                                </Button>
                                <Button color='green' size='tiny' onClick={this.deleteTask}>
                                    <Icon name='checkmark'/>
                                    Có
                                </Button>
                            </Modal.Actions>
                        </Modal>
                        <Modal open={openModalEditor} onClose={this.closeModalEditor} trigger={<Dropdown.Item icon='code' onClick={this.openModalEditor} text = 'Trình soạn thảo' />} size='fullscreen' closeIcon>
                            <Header icon='hashtag' content='Trình soạn thảo'/>
                            <Modal.Content>
                                <ModalTaskEditor taskID={this.props.data._id} />
                            </Modal.Content>
                        </Modal>
                    </Dropdown.Menu>
                </Dropdown>
                <Header
                    size='small'
                    style={{
                    marginBottom: 5,
                    marginTop: 5
                }}>
                    {this.props.data.responsible_user.length === 1 ? (
                        <Image
                            size='mini'
                            spaced
                            src={this.props.data.responsible_user[0].image}/>
                    ) : (
                        <div id='wrapper-photos'>
                            <section id="photos">
                                {this.props.data.responsible_user.map(user => (
                                    <Image
                                        key={user._id}
                                        size='mini'
                                        src={user.image}/>
                                ))}
                            </section>
                        </div>
                    )}
                    
                    <Header.Content style={{width: 193}}>
                        <Popup wide flowing hoverable position='right center' trigger={<div style={{fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{this.props.data.task_name} ({nameResponseUser})</div>}>
                        <List verticalAlign='middle'>
                            {this.props.data.responsible_user.map(user => (
                                <List.Item key={user._id}>
                                    <Image avatar src={user.image} />
                                    <List.Content>
                                        <List.Header>{user.firstname} {user.lastname}</List.Header>
                                    </List.Content>
                                </List.Item>
                            ))}
                        </List>
                        </Popup>
                        <Header.Subheader>
                            <TimeAgo date={this.props.data.createdAt} />
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Container style={{
                    marginBottom: 10
                }}>
                    {this.props.data.description}
                </Container>
                <Divider fitted />
                <div style={{marginTop: 5}}>
                    <Label circular size='mini' color='blue' title={this.props.data.level}>{this.props.data.level}</Label>
                    {new Date() > new Date(this.props.data.end_day) ? (<Label circular size='mini' color='red' title='Out of date'>Hết hạn</Label>) : ''}
                    {this.props.data.labels.map(label => (
                        <Label key={label} size='mini' basic title={label} >{label}</Label>
                    ))}
                </div>
            </div>
        )
    }
}

export default TaskItem;