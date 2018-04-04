import React from 'react';
import { Table, Image, Button, Modal, Form, Dropdown, Header, Input, Label } from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';

let skills_description = {
    analyst_capability: [
        {
            value: 0,
            text: 'Năng lực của nhân viên ≥ 15% tổng số nhân viên.'
        },
        {
            value: 1,
            text: 'Năng lực của nhân viên ≥ 35% tổng số nhân viên.'
        },
        {
            value: 2,
            text: 'Năng lực của nhân viên ≥ 55% tổng số nhân viên.'
        },
        {
            value: 3,
            text: 'Năng lực của nhân viên ≥ 75% tổng số nhân viên.'
        },
        {
            value: 4,
            text: 'Năng lực của nhân viên ≥ 90% tổng số nhân viên.'
        }
    ],
    programmer_capability: [
        {
            value: 0,
            text: 'Năng lực của nhân viên ≥ 15% tổng số nhân viên.'
        },
        {
            value: 1,
            text: 'Năng lực của nhân viên ≥ 35% tổng số nhân viên.'
        },
        {
            value: 2,
            text: 'Năng lực của nhân viên ≥ 55% tổng số nhân viên.'
        },
        {
            value: 3,
            text: 'Năng lực của nhân viên ≥ 75% tổng số nhân viên.'
        },
        {
            value: 4,
            text: 'Năng lực của nhân viên ≥ 90% tổng số nhân viên.'
        }
    ],
    application_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ],
    platform_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ],
    language_and_toolset_experience: [
        {
            value: 0,
            text: 'Kinh nghiệm <= 02 tháng.'
        },
        {
            value: 1,
            text: 'Kinh nghiệm 06 tháng.'
        },
        {
            value: 2,
            text: 'Kinh nghiệm 01 năm.'
        },
        {
            value: 3,
            text: 'Kinh nghiệm 03 năm.'
        },
        {
            value: 4,
            text: 'Kinh nghiệm 06 năm.'
        }
    ]
};

class ModalEditUserSkills extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateEdit: false,
            analyst_capability: this.props.user.analyst_capability,
            programmer_capability: this.props.user.programmer_capability,
            application_experience: this.props.user.application_experience,
            platform_experience: this.props.user.platform_experience,
            language_and_toolset_experience: this.props.user.language_and_toolset_experience,
            salary: this.props.user.salary,
            admin: this.props.user.admin,
            analystCapabilityOptions: skills_description.analyst_capability,
            programmerCapabilityOptions: skills_description.programmer_capability,
            applicationExperienceOptions: skills_description.application_experience,
            platformExperienceOptions: skills_description.platform_experience,
            languageAndToolsetExperienceOptions: skills_description.language_and_toolset_experience,
            showAlert: false,
            contentAlert: '',
            typeAlert: 'success'     
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeView = this.changeView.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.showAlert = this.showAlert.bind(this);
    }
    
    changeView(state) {
        if (state === 'edit') {
            this.setState({
                stateView: false,
                stateEdit: true
            });
        } else if (state === 'view') {
            this.setState({
                stateView: true,
                stateEdit: false
            });
        }
    }

    convertSkillNumberToDescription(number_skill, type_skill) {
        let index = _.findIndex(skills_description[type_skill], ['value', number_skill]);
        return skills_description[type_skill][index].text;
    }
    
    handleChange(e, { name, value }) {
        console.log(name, value);
        this.setState({
            [name]: value
        });
    }

    updateProfile() {
        axios.put(`/api/users/${this.props.user._id}/skill`, {
            analyst_capability: this.state.analyst_capability,
            programmer_capability: this.state.programmer_capability,
            application_experience: this.state.application_experience,
            platform_experience: this.state.platform_experience,
            language_and_toolset_experience: this.state.language_and_toolset_experience,
            salary: this.state.salary,
            admin: this.state.admin
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            if(response && response.data.success) {
                this.showAlert('Update Successful.', 'success', 2000);
                this.changeView('view');
            } else {
                this.showAlert('Update Failed.', 'error', 2000);
            }
        });
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
        return (
            <div>
                <SweetAlert
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />
            <Modal size={'small'} closeIcon trigger={<Button fluid color='teal'>Xem và chỉnh sửa</Button>} >
                <Modal.Header>
                    <Header size='small' icon='hashtag' content='Xem và chỉnh sửa kỹ năng nhân viên'/>
                </Modal.Header>
                <Modal.Content image scrolling>
                    {this.state.stateView ? 
                        [
                            <Image key={'avatar_profile'} wrapped size='medium' src={this.props.user.image} />,
                            <Modal.Description key={'info_profile_table'}>
                                <Table basic='very'>           
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell width={4}>
                                                <h4>Tên</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.firstname}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Họ</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.lastname}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Giới tính</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.gender === true ? 'Nam' : 'Nữ'}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Email</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.email} 
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Tên định danh</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.username}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Quản trị viên</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.admin === 1 ? "Có" : "Không"}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Lương</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                $ {this.props.user.salary}
                                            </Table.Cell>
                                        </Table.Row> 
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Đã làm việc tại</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.worked_at.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Đã học tại</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.studied_at.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Ngôn ngữ lập trình</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.props.user.language_programming.join()}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Khả năng phân tích</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.analyst_capability, 'analyst_capability')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Khả năng lập trình</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.programmer_capability, 'programmer_capability')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Kinh nghiệm ứng dụng</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.application_experience, 'application_experience')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Kinh nghiệm nền tảng</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.platform_experience, 'platform_experience')}
                                            </Table.Cell>
                                        </Table.Row>
                                        <Table.Row>
                                            <Table.Cell>
                                                <h4>Kinh nghiệm ngôn ngữ và công cụ</h4>
                                            </Table.Cell>
                                            <Table.Cell>
                                                {this.convertSkillNumberToDescription(this.props.user.language_and_toolset_experience, 'language_and_toolset_experience')}
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
                        ] : 
                        [
                            <Image key={'avatar_profile_edit'} wrapped size='medium' style={{cursor: 'pointer'}} src={this.props.user.image} />,
                            <Modal.Description key={'info_profile_table_edit'}>
                                <Form onSubmit={this.updateProfile} >
                                    <Table basic='very'>           
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell width={4}>
                                                    <h4>Tên</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.firstname}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Họ</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.lastname}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Giới tính</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.gender === true ? 'Nam' : 'Nữ'}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Email</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.email} 
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Tên định danh</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.username}
                                                </Table.Cell>
                                            </Table.Row> 
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Đã làm việc tại</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.worked_at.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Đã học tại</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.studied_at.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Ngôn ngữ lập trình</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {this.props.user.language_programming.join()}
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Quản trị viên</h4>
                                                </Table.Cell>
                                                <Table.Cell> 
                                                    <Form.Group inline style={{marginBottom: 0}}>
                                                        <Form.Radio label='Có' name='admin' value={1} checked={this.state.admin === 1} onChange={this.handleChange} />
                                                        <Form.Radio label='Không' name='admin' value={0} checked={this.state.admin === 0} onChange={this.handleChange} />
                                                    </Form.Group>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Lương</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Input labelPosition='right' type='number' value={this.state.salary} name='salary' fluid placeholder='Amount' onChange={this.handleChange}>
                                                        <Label basic>$</Label>
                                                        <input />
                                                        <Label>.00</Label>
                                                    </Input>
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Khả năng phân tích</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Chọn cấp độ kỹ năng' 
                                                        name='analyst_capability' 
                                                        value={this.state.analyst_capability} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.analystCapabilityOptions} 
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Khả năng lập trình</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Chọn cấp độ kỹ năng' 
                                                        name='programmer_capability'
                                                        value={this.state.programmer_capability} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.programmerCapabilityOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Kinh nghiệm ứng dụng</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Chọn cấp độ kỹ năng' 
                                                        name='application_experience'
                                                        value={this.state.application_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.applicationExperienceOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Kinh nghiệm nền tảng</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Chọn cấp độ kỹ năng' 
                                                        name='platform_experience'
                                                        value={this.state.platform_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.platformExperienceOptions}
                                                        onChange={this.handleChange} />
                                                </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell>
                                                    <h4>Kinh nghiệm ngôn ngữ và công cụ</h4>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Dropdown 
                                                        placeholder='Chọn cấp độ kỹ năng' 
                                                        name='language_and_toolset_experience'
                                                        value={this.state.language_and_toolset_experience} 
                                                        fluid 
                                                        selection 
                                                        options={this.state.languageAndToolsetExperienceOptions}
                                                        onChange={this.handleChange} />
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
                        ]
                    }
                </Modal.Content>
            </Modal>
            </div>
        )
    }
}

export default ModalEditUserSkills;