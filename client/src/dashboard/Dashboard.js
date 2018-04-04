import React from 'react';
import { connect } from 'react-redux';
import {
    Grid,
    Container,
    Header,
    Segment,
    Form,
    Image,
    Input,
    Icon,
    Message,
    Button,
    Table,
    Rating,
    Menu,
    Popup
} from 'semantic-ui-react';
import axios from 'axios';
import _ from 'lodash';
import SweetAlert from 'sweetalert2-react';
import 'sweetalert2/dist/sweetalert2.css';

import ModalEditUserSkills from './ModalEditUserSkills';


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            email: '',
            submitIntive: false,
            emailValid: true,
            emailErrorMessage: '',
            isLoadingSearchUser: false, 
            userResults: [],
            userValue: '',
            showAlert: false,
            contentAlert: '',
            typeAlert: 'success',
            column: null,
            tableData: [],
            direction: null,
            numberShow: 15
        };
        this._changeEmail = this._changeEmail.bind(this);
        this._handleInvite = this._handleInvite.bind(this);
        this._getUserWaitingList =this._getUserWaitingList.bind(this);
        this._getUserList = this._getUserList.bind(this);
        this._handleSearchChangeUser = this._handleSearchChangeUser.bind(this);
        this._cancelUserWaiting = this._cancelUserWaiting.bind(this);
        this._deleteUser = this._deleteUser.bind(this);
        this._showAlert = this._showAlert.bind(this);
        this._addNumberShow = this._addNumberShow.bind(this);
        this._refreshData = this._refreshData.bind(this);
    }
    _changeEmail(e) {
        this.setState({
            email: e.target.value
        });
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(e.target.value)) {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: '',
                email: e.target.value
            });
        }
        else {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: 'Your email is invalid.',
                email: e.target.value
            });
        }
    }
    _handleInvite() {
        this.setState({
            loading: true
        });
        if (this.state.emailValid) {
            console.log(this.state.email);
            axios.post(`/api/users/company/${this.props.profileUser.profile.current_company._id}`, 
                { 
                    email: this.state.email
                }, 
                { headers: { 'x-access-token': localStorage.token }
            }).then(response => {
                // do some stuff here
                console.log(response);
                if(response.data.success) {
                    this._showAlert('Invite Successful.', 'success', 2000);
                } else {
                    this._showAlert('Invite Failed.', 'error', 2000);
                }
                this.setState({
                    loading: false,
                    email: ''
                });   
            });
        }
        else {
            this.setState({
                loading: false
            });
        }
    }

    _getUserList(id) {
        axios
            .get(`/api/users/all/company/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response.data.success) {
                this.setState({
                    tableData: [...this.state.tableData, ...response.data.users]
                });
            }
            console.log(response);
        });
    }

    _getUserWaitingList(id) {
        axios
            .get(`/api/users/waiting/company/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response.data.success) {
                this.setState({
                    tableData: [...this.state.tableData, ...response.data.users]
                });
            }
            console.log(response);
        });
    }

    _handleSearchChangeUser(e, { value }) {
        this.setState({
            isLoadingSearchUser: true,
            userValue: value,
            numberShow: 15
        });
        setTimeout(() => {
            if (value.length < 1) {
                this.setState({
                    isLoadingSearchUser: false,
                    userResults: [],
                });
            }
            else {
                const re = new RegExp(_.escapeRegExp(value), 'i');
                const isMatch = result => re.test(result.firstname);
          
                this.setState({
                    isLoadingSearchUser: false,
                    userResults: _.filter(this.state.tableData, isMatch),
                });
            }
        }, 500);
    }

    _cancelUserWaiting(id) {
        axios
            .delete(`/api/users/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response && response.data.success) {
                this._showAlert('Cancel Successful.', 'success', 2000);
            } else {
                this._showAlert('Cancel Failed.', 'error', 2000);
            }
            console.log(response);
        });
    }

    _deleteUser(id) {
        axios
            .delete(`/api/users/${id}`, {
            headers: {
                'x-access-token': localStorage.token
            }
        })
        .then(response => {
            // do some stuff here
            if(response && response.data.success) {
                this._showAlert('Delete Successful.', 'success', 2000);
            } else {
                this._showAlert('Delete Failed.', 'error', 2000);
            }
            console.log(response);
        });
    }

    _showAlert(content, type, timeout) {
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

    componentWillReceiveProps(nextProps) {
        if (nextProps.profileUser.profile.current_company._id) {
            this._getUserList(nextProps.profileUser.profile.current_company._id);
            this._getUserWaitingList(nextProps.profileUser.profile.current_company._id);   
        }
    }

    componentDidMount() {
        if (this.props.profileUser.profile.current_company._id) {
            this._getUserList(this.props.profileUser.profile.current_company._id);
            this._getUserWaitingList(this.props.profileUser.profile.current_company._id); 
        }
    }

    _handleSort = clickedColumn => () => {
        const {column, tableData, direction} = this.state;
        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                tableData: _.sortBy(tableData, [clickedColumn]),
                direction: 'ascending'
            });

            return;
        }
        this.setState({
            tableData: tableData.reverse(),
            direction: direction === 'ascending'
                ? 'descending'
                : 'ascending'
        });
    }

    _addNumberShow() {
        this.setState({
            numberShow: this.state.numberShow + 15
        });
    }

    _refreshData() {
        this.setState({
            tableData: []
        }, () => {
            this._getUserList(this.props.profileUser.profile.current_company._id);
            this._getUserWaitingList(this.props.profileUser.profile.current_company._id);
        })
    }

    render() {
        const { column, tableData, direction } = this.state;
        return (
            <Container fluid>
                <SweetAlert
                    show={this.state.showAlert}
                    title={this.state.typeAlert === 'success' ? 'Success!' : 'Error!'}
                    text={this.state.contentAlert}
                    type={this.state.typeAlert}
                    showConfirmButton = {false}
                />
                {this.props.profileUser.profile.admin === 1 ? (
                    <Grid>
                        <Grid.Column mobile={15} tablet={15} computer={15} style={{margin: '0 auto'}}>
                            <Grid.Row>
                                <Segment color='blue'>
                                    <Header as='h2'>Mời nhân viên</Header>
                                    <Form onSubmit={this._handleInvite}>     
                                        <Form.Input size='big' label='Email' placeholder='example@gmail.com' onChange={this._changeEmail} required/>
                                        <Message
                                            visible={!this.state.emailValid}
                                            error
                                            header='Error'
                                            content={this.state.emailErrorMessage}
                                        />
                                        {!this.state.loading ? 
                                            <Form.Button fluid size='large' type='submit' color='blue'>Mời</Form.Button> : 
                                            <Form.Button fluid size='large' loading disabled color='blue'>Mời</Form.Button>
                                        }
                                    </Form>
                                </Segment>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column mobile={15} tablet={15} computer={15} style={{margin: '0 auto'}}>
                            <Grid.Row>
                                <Segment color='teal'>
                                    <Header as='h2' style={{display: 'inline-block', marginRight: 10}}>Danh sách nhân viên</Header> 
                                    <Popup
                                        position='top center'
                                        trigger={<Button size='small' floated='right' circular icon='refresh' onClick={this._refreshData} />}
                                        content='Làm mới'
                                    />
                                    <Input
                                        loading={this.state.isLoadingSearchUser}
                                        onChange={this._handleSearchChangeUser}
                                        icon='search' 
                                        fluid 
                                        placeholder='Tìm kiếm...'
                                    />
                                    <Table sortable celled padded stackable size='small'>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell title='Họ Tên' sorted={column === 'firstname' ? direction : null} onClick={this._handleSort('firstname')}>
                                                    Họ tên
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Lương' sorted={column === 'salary' ? direction : null} onClick={this._handleSort('salary')}>
                                                    Lương
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Khả năng phân tích' sorted={column === 'analyst_capability' ? direction : null} onClick={this._handleSort('analyst_capability')}>
                                                    Khả năng phân tích
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Kinh nghiệm ứng dụng' sorted={column === 'application_experience' ? direction : null} onClick={this._handleSort('application_experience')}>
                                                    Kinh nghiệm ứng dụng
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Kinh nghiệm về ngôn ngữ và công cụ' sorted={column === 'language_and_toolset_experience' ? direction : null} onClick={this._handleSort('language_and_toolset_experience')}>
                                                    Kinh nghiệm về ngôn ngữ và công cụ
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Kinh nghiệm nền tảng' sorted={column === 'platform_experience' ? direction : null} onClick={this._handleSort('platform_experience')}>
                                                    Kinh nghiệm nền tảng
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Khả năng lập trình' sorted={column === 'programmer_capability' ? direction : null} onClick={this._handleSort('programmer_capability')}>
                                                    Khả năng lập trình
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Trạng thái' sorted={column === 'status' ? direction : null} onClick={this._handleSort('status')}>
                                                    Trạng thái
                                                </Table.HeaderCell>
                                                <Table.HeaderCell title='Hành động' sorted={column === 'status' ? direction : null} onClick={this._handleSort('status')}>
                                                    Hành động
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {this.state.userValue.length > 0 ? (
                                                this.state.userResults.length > 0 ? (
                                                    _.map(_.slice(this.state.userResults, 0, this.state.numberShow), (user) => (
                                                        <Table.Row key={user._id}>
                                                            <Table.Cell>
                                                                <Header as='h4' image>
                                                                    <Image src={user.image} rounded='true' size='mini' />
                                                                    <Header.Content>
                                                                        {user.firstname} {user.lastname}
                                                                    <Header.Subheader>{user.email}</Header.Subheader>
                                                                    </Header.Content>
                                                                </Header>
                                                            </Table.Cell>
                                                            <Table.Cell>$ {user.salary ? user.salary : '0'}</Table.Cell>
                                                            <Table.Cell>{user.analyst_capability} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                            <Table.Cell>{user.application_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                            <Table.Cell>{user.language_and_toolset_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                            <Table.Cell>{user.platform_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                            <Table.Cell>{user.programmer_capability} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                            {user.status ? <Table.Cell positive><Icon name='checkmark' />Đã kích hoạt</Table.Cell>: <Table.Cell error><Icon name='attention' /> Chưa kích hoạt</Table.Cell>}
                                                            <Table.Cell>
                                                                {user.status ? (
                                                                    <ModalEditUserSkills user={user} />
                                                                ) : (
                                                                    <Button fluid color='red' size='small' onClick={this._cancelUserWaiting.bind(this, user._id)}>Hủy mời</Button>
                                                                )} 
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))
                                                ) : (
                                                    <Table.Row>
                                                        <Table.HeaderCell colSpan='16'>
                                                            <h1 style={{textAlign: 'center'}}>Không tìm thấy kết quả.</h1>
                                                        </Table.HeaderCell>
                                                    </Table.Row>
                                                )
                                            ) : (
                                                _.map(_.slice(tableData, 0, this.state.numberShow), (user) => (
                                                    <Table.Row key={user._id}>
                                                        <Table.Cell>
                                                            <Header as='h4' image>
                                                                <Image src={user.image} rounded='true' size='mini' />
                                                                <Header.Content>
                                                                    {user.firstname} {user.lastname}
                                                                <Header.Subheader>{user.email}</Header.Subheader>
                                                                </Header.Content>
                                                            </Header>
                                                        </Table.Cell>
                                                        <Table.Cell>$ {user.salary ? user.salary : '0'}</Table.Cell>
                                                        <Table.Cell>{user.analyst_capability} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                        <Table.Cell>{user.application_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                        <Table.Cell>{user.language_and_toolset_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                        <Table.Cell>{user.platform_experience} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                        <Table.Cell>{user.programmer_capability} <Rating icon='star' defaultRating={1} maxRating={1} disabled /></Table.Cell>
                                                        {user.status ? <Table.Cell positive><Icon name='checkmark' />Đã kích hoạt</Table.Cell>: <Table.Cell error><Icon name='attention' /> Chưa kích hoạt</Table.Cell>}
                                                        <Table.Cell>
                                                            {user.status ? (
                                                                <ModalEditUserSkills user={user} />
                                                            ) : (
                                                                <Button fluid color='red' size='small' onClick={this._cancelUserWaiting.bind(this, user._id)}>Hủy mời</Button>
                                                            )} 
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))
                                            )
                                            }
                                        </Table.Body>
                                        <Table.Footer>
                                            <Table.Row>
                                                <Table.HeaderCell textAlign='center' colSpan='16'>
                                                    <Popup
                                                        position='top center'
                                                        trigger={<Button circular icon='chevron down' onClick={this._addNumberShow} />}
                                                        content='Tải thêm'
                                                    />
                                                </Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Footer>
                                    </Table>
                                </Segment>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid>
                ) : (
                    <h1 style={{textAlign: 'center'}}><Icon name='lock' />Bạn không có quyền truy cập trang này.</h1>
                )}
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
		profileUser: state.userReducer
	};
}

export default connect(mapStateToProps)(Dashboard);