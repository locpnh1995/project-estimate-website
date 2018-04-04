import React from 'react';
import { connect } from 'react-redux';
import { getUserInfo } from './UserActions';
import { Table, Image, Button, Modal, Form, Dropdown } from 'semantic-ui-react';
import { updateUserInfo } from './UserActions';
import axios from 'axios';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateEdit: false,
            stateEditPassword: false,
            workedAtOptions: [...this.formatDropdownValue(this.props.data.profile.worked_at)],
            studiedAtOptions: [...this.formatDropdownValue(this.props.data.profile.studied_at)],
            languageProgrammingOptions: [...this.formatDropdownValue(this.props.data.profile.language_programming)],
            first_name: this.props.data.profile.firstname,
            last_name: this.props.data.profile.lastname,
            gender: this.props.data.profile.gender,
            worked_at: this.props.data.profile.worked_at,
            studied_at: this.props.data.profile.studied_at,
            language_programming: this.props.data.profile.language_programming,
            old_password: '',
            new_password: '',
            confirm_password: '',
            showAlert: false,
            contentAlert: '',
            typeAlert: 'success' 
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeView = this.changeView.bind(this);
        this.handleAddition = this.handleAddition.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.createElementUpload = this.createElementUpload.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }

    formatDropdownValue(arrayValue) {
        var formatValue = [];
        for (let value of arrayValue) {
            formatValue.push({ text: value, value });
        }
        return formatValue;
    }

    changeView(state) {
        if (state === 'edit') {
            this.setState({
                stateView: false,
                stateEditPassword: false,
                stateEdit: true
            });
        } else if (state === 'view') {
            this.setState({
                stateView: true,
                stateEditPassword: false,
                stateEdit: false
            });
        } else if (state === 'edit_pass') {
            this.setState({
                stateView: false,
                stateEditPassword: true,
                stateEdit: false
            });
        }
    }

    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({
            [name]: value
        });
    }

    handleAddition(e, { name, value }) {
        let mapName = {
            worked_at: 'workedAtOptions', 
            studied_at: 'studiedAtOptions', 
            language_programming: 'languageProgrammingOptions'
        };
        this.setState({
            [ mapName[name] ]: [{ text: value, value }, ...this.state[ mapName[name] ]],
        });
    }

    updateProfile() {
        axios.put(`/api/users/${this.props.data.profile._id}`, {
            firstname: this.state.first_name,
            lastname: this.state.last_name,
            gender: this.state.gender,
            worked_at: this.state.worked_at,
            studied_at: this.state.studied_at,
            language_programming: this.state.language_programming
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            if(response.data.success) {
                this.props.updateUserInfo(response.data.user);
                this.showAlert('Update Successful.', 'success', 2000);
                this.changeView('view');
            } else {
                this.showAlert('Update Failed.', 'error', 2000);
                console.log(response);
            }
        });
    }

    updatePassword() {
        // check password before submitting
        axios.put(`/api/users/${this.props.data.profile._id}?change_password=true`, {
            old_password: this.state.old_password,
            new_password: this.state.new_password,
            confirm_password: this.state.confirm_password
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            if(response.data.success) {
                this.showAlert('Update Successful.', 'success', 2000);
                this.changeView('edit');
            } else {
                this.showAlert('Update Failed.', 'error', 2000);
                console.log(response);
            }
        });
    }

    createElementUpload() {
        let upload = document.createElement('input');
        upload.style.display = 'none';
        upload.type = 'file';
        upload.name = 'file';
        upload.accept = 'image/*';
        upload.onchange = (e) => {
            console.log(upload.files, e);
            let selectedFile = upload.files[0];
            let fd = new FormData();
            fd.append('file', selectedFile);
            axios.put(`/api/users/image/${this.props.data.profile._id}`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': localStorage.token
                }
            }).then(response => {
                console.log(response);
                this.props.updateUserInfo(response.data.user);
                this.changeView('view');
            });
        };
        return upload;
    }

    updateAvatar() {
        let upload = this.createElementUpload();
        upload.click();
    }

    showAlert(content, type, timeout) {
        this.setState({
            showAlert: true,
            typeAlert: type,
            contentAlert: content
        });
        setTimeout(() => {
            this.setState({
                showAlert: false,
                typeAlert: 'success',
                contentAlert: ''
            });
        }, timeout);
    }

    render() {
        if (this.state.stateView) {
            return [
                <SweetAlert key={'alert'}
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />,
                <Image key={'avatar_profile'} wrapped size='medium' src={this.props.data.profile.image} />,
                <Modal.Description key={'info_profile_table'}>
                    <Table basic='very'>           
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={4}>
                                    <h4>Tên</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.firstname}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Họ</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.lastname}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Giới tính</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.gender === true ? 'Nam' : 'Nữ'}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Email</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.email} 
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Tên định danh</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.username}
                                </Table.Cell>
                            </Table.Row> 
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Mật khẩu</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    *************
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Đã làm việc tại</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.worked_at.join(', ')}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Đã học tại</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.studied_at.join(', ')}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Ngôn ngữ lập trình</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.props.data.profile.language_programming.join(', ')}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell colSpan='2'>
                                    <Button fluid onClick={this.changeView.bind(this, 'edit')}>Cập nhật thông tin</Button>
                                </Table.Cell>
                            </Table.Row>                 
                        </Table.Body>
                    </Table>
                </Modal.Description>
            ];
        }
        if (this.state.stateEdit) {
            return [
                <SweetAlert key={'alert'}
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />,
                <Image key={'avatar_profile_edit'} wrapped size='medium' style={{cursor: 'pointer'}} src={this.props.data.profile.image} onClick={this.updateAvatar} />,
                <Modal.Description key={'info_profile_table_edit'}>
                    <Form onSubmit={this.updateProfile}>
                        <Table basic='very'>           
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={4}>
                                        <h4>Tên</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='first_name' type='text' value={this.state.first_name} onChange={this.handleChange} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Họ</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='last_name' type='text' value={this.state.last_name} onChange={this.handleChange} />  
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Giới tính</h4>
                                    </Table.Cell>
                                    <Table.Cell> 
                                        <Form.Group inline style={{marginBottom: 0}}>
                                            <Form.Radio label='Nam' name='gender' value={true} checked={this.state.gender === true} onChange={this.handleChange} />
                                            <Form.Radio label='Nữ' name='gender' value={false} checked={this.state.gender === false} onChange={this.handleChange} />
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Email</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='email' type='text' value={this.props.data.profile.email} readOnly />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Tên định danh</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='username' type='text' value={this.props.data.profile.username} readOnly />
                                    </Table.Cell>
                                </Table.Row> 
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Mật khẩu</h4>
                                    </Table.Cell>
                                    <Table.Cell> 
                                        <Form.Group>    
                                            <Form.Input name='password' type='password' value={'*************'} readOnly />
                                            <Form.Button color='red' icon='setting' content='Thay đổi' type='button' onClick={this.changeView.bind(this, 'edit_pass')}></Form.Button>
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Đã làm việc tại</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='worked_at'
                                            options={this.state.workedAtOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.worked_at}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Đã học tại</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='studied_at'
                                            options={this.state.studiedAtOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.studied_at}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Ngôn ngữ lập trình</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Dropdown
                                            name='language_programming'
                                            options={this.state.languageProgrammingOptions}
                                            search
                                            selection
                                            fluid
                                            multiple
                                            allowAdditions
                                            value={this.state.language_programming}
                                            onAddItem={this.handleAddition}
                                            onChange={this.handleChange}
                                        />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan='2'>
                                        <Form.Group widths='equal'>
                                            <Button fluid type='submit' color='green' >Cập nhật</Button>
                                            <Button fluid type='button' onClick={this.changeView.bind(this, 'view')}>Xem thông tin</Button>
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>                 
                            </Table.Body>
                        </Table>
                    </Form>
                </Modal.Description>
            ];
        }
        if (this.state.stateEditPassword) {
            return [
                <SweetAlert key={'alert'}
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />,
                <Image key={'avatar_profile_edit_password'} wrapped size='medium' src={this.props.data.profile.image} />,
                <Modal.Description key={'info_profile_table_edit'}>
                    <Form onSubmit={this.updatePassword}>
                        <Table basic='very'>           
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={3}>
                                        <h4>Mật khẩu cũ</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='old_password' type='password'  onChange={this.handleChange} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Mật khẩu mới</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='new_password' type='password' onChange={this.handleChange} />  
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Xác nhận lại mật khẩu</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input name='confirm_password' type='password' onChange={this.handleChange} />  
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell colSpan='2'>
                                        <Form.Group widths='equal'>
                                            <Button fluid type='submit' color='green'>Cập nhật mật khẩu</Button>
                                            <Button fluid type='button' onClick={this.changeView.bind(this, 'edit')}>Quay lại</Button>
                                        </Form.Group>
                                    </Table.Cell>
                                </Table.Row>                 
                            </Table.Body>
                        </Table>
                    </Form>
                </Modal.Description>
            ];
        }
    }
}

const mapStateToProps = (state) => {
    return {data: state.userReducer};
}

const mapDispatchToProps = {
    getUserInfo,
    updateUserInfo
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);