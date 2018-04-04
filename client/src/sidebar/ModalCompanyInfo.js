import React from 'react';
import { Table, Image, Button, Modal, Form } from 'semantic-ui-react';
import axios from 'axios';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';

class ModalCompanyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateView: true,
            stateEdit: false,
            showAlert: false,
            contentAlert: '',
            typeAlert: 'success',
            company: this.props.company,
            company_name: this.props.company.company_name,
            address: this.props.company.address,
            description: this.props.company.description,
            field: this.props.company.field,
            image: this.props.company.image 
        };
        this.handleChange = this.handleChange.bind(this);
        this.changeView = this.changeView.bind(this);
        this.showAlert = this.showAlert.bind(this);
        this.updateCompanyInfo = this.updateCompanyInfo.bind(this);
        this.updateAvatar = this.updateAvatar.bind(this);
        this.createElementUpload = this.createElementUpload.bind(this);
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

    handleChange(e, { name, value }) {
        this.setState({
            [name]: value
        });
    }

    updateCompanyInfo() {
        axios.put(`/api/companies/${this.state.company._id}`, {
            address: this.state.address,
            description: this.state.description,
            field: this.state.field
        }, {
            headers: { 'x-access-token': localStorage.token }
        }).then(response => {
            if(response.data.success) {
                this.setState({
                    company_name: response.data.company.company_name,
                    address: response.data.company.address,
                    description: response.data.company.description,
                    field: response.data.company.field,
                    image: response.data.company.image 
                });
                this.showAlert('Update Successful.', 'success', 2000);
                this.changeView('view');
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
            axios.put(`/api/companies/image/${this.state.company._id}`, fd, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'x-access-token': localStorage.token
                }
            }).then(response => {
                console.log(response);
                this.setState({
                    image: response.data.company.image
                });
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
        if(this.state.stateView) {
            return [
                <SweetAlert key={'alert'}
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />,
                <Image key={'avatar_company'} wrapped size='medium' src={this.state.image} />,
                <Modal.Description key={'info_company_table'}>
                    <Table basic='very'>           
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell width={4}>
                                    <h4>tên công ty</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.company_name}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Địa chỉ</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.address}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Lĩnh vực</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.field}
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <h4>Mô tả</h4>
                                </Table.Cell>
                                <Table.Cell>
                                    {this.state.description} 
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
        if(this.state.stateEdit) {
            return [
                <SweetAlert key={'alert'}
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />,
                <Image key={'avatar_company'} wrapped size='medium' style={{cursor: 'pointer'}} src={this.state.image} onClick={this.updateAvatar} />,
                <Modal.Description key={'info_company_table'}>
                    <Form onSubmit={this.updateCompanyInfo}>
                        <Table basic='very'>           
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={2}>
                                        <h4>Tên công ty</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input type='text' value={this.state.company_name} readOnly />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Địa chỉ</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input type='text' name='address' value={this.state.address} onChange={this.handleChange} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Lĩnh vực</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.Input type='text' name='field' value={this.state.field} onChange={this.handleChange} />
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell>
                                        <h4>Mô tả</h4>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Form.TextArea name='description' value={this.state.description} onChange={this.handleChange} />
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
        
    }
}

export default ModalCompanyInfo;