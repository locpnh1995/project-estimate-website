import React from 'react';
import {connect} from 'react-redux';
import {
    Container,
    Button,
    Checkbox,
    Form,
    Segment,
    Header,
    Message
} from 'semantic-ui-react';
import {register, changeRegisterForm} from './AuthActions';
import axios from 'axios';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companynameErrorMessage: '',
            emailErrorMessage: '',
            usernameErrorMessage: '',
            passwordErrorMessage: '',
            confirmPasswordErrorMessage: '',
            companynameValid: '',
            emailValid: '',
            usernameValid: '',
            passwordValid: '',
            confirmPasswordValid: '',
            submitSignup: false
        };
        this._changeEmail = this._changeEmail.bind(this);
        this._changeUsername = this._changeUsername.bind(this);
        this._changePassword = this._changePassword.bind(this);
        this._changeConfirmPassword = this._changeConfirmPassword.bind(this);
        this._changeCompanyName = this._changeCompanyName.bind(this);
        this._handleSignup = this._handleSignup.bind(this);
        this._emitChange = this._emitChange.bind(this);
    }
    _handleSignup(e) {
        e.preventDefault();
        this.setState({submitSignup: true});
        if(this.state.emailValid && this.state.usernameValid && this.state.passwordValid && this.state.confirmPasswordValid && this.state.companynameValid) {
            this
                .props
                .register(  this.props.data.formRegisterState.company_name,
                            this.props.data.formRegisterState.email, 
                            this.props.data.formRegisterState.username, 
                            this.props.data.formRegisterState.password, 
                            this.props.data.formRegisterState.confirm_password)
                .then(response => {
                    if (response && response.success) {
                        this
                            .props
                            .history
                            .push(this.props.match.url);
                    }
                })
        }
    }
    _changeEmail(e) {
        this.setState({submitSignup: false});
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(regex.test(e.target.value)) {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: ''
            });
        }
        else {
            this.setState({
                emailValid: regex.test(e.target.value),
                emailErrorMessage: 'Your email is invalid.'
            });
        }
        var newState = {
            ...this.props.data.formRegisterState,
            email: e.target.value
        };
        this._emitChange(newState);
    }
    _changeUsername(e) {
        this.setState({submitSignup: false});
        if(e.target.value.length > 3 && e.target.value.length < 50) {
            this.setState({
                usernameValid: true,
                usernameErrorMessage: ''
            });
        }
        else {
            this.setState({
                usernameValid: false,
                usernameErrorMessage: 'Your username too short or too long.'
            });
        }
        var newState = {
            ...this.props.data.formRegisterState,
            username: e.target.value
        };
        this._emitChange(newState);
    }
    _changePassword(e) {
        this.setState({submitSignup: false});
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,50}$/;
        if(regex.test(e.target.value)) {
            this.setState({
                passwordValid: regex.test(e.target.value),
                passwordErrorMessage: ''
            });
        }
        else {
            this.setState({
                passwordValid: regex.test(e.target.value),
                passwordErrorMessage: 'Your password must contain at least 8 characters, including UPPER/lowercase, number and special characters.'
            });
        }
        var newState = {
            ...this.props.data.formRegisterState,
            password: e.target.value
        };
        this._emitChange(newState);
    }
    _changeConfirmPassword(e) {
        this.setState({submitSignup: false});
        if(e.target.value === this.props.data.formRegisterState.password) {
            this.setState({
                confirmPasswordValid: true,
                confirmPasswordErrorMessage: ''
            });
        }
        else {
            this.setState({
                confirmPasswordValid: false,
                confirmPasswordErrorMessage: 'Your password and confirmation password do not match.'
            });
        }
        var newState = {
            ...this.props.data.formRegisterState,
            confirm_password: e.target.value
        };
        this._emitChange(newState);
    }

    _checkCompanyName = async (e) => {
        this.setState({submitSignup: false});
        let response = await axios.get(`/api/checkCompany/${e.target.value}`);
        let checkCompany = response.data.success;
        if (checkCompany) {
            this.setState({
                companynameValid: false,
                companynameErrorMessage: 'Your company name is already taken.'
            });
        }
    }

    _changeCompanyName(e) {
        this.setState({submitSignup: false});     
        if(e.target.value.length > 3 && e.target.value.length < 50) {
            this.setState({
                companynameValid: true,
                companynameErrorMessage: ''
            });
        }
        else {
            this.setState({
                companynameValid: false,
                companynameErrorMessage: 'Your company name too short or too long.'
            });
        }
        var newState = {
            ...this.props.data.formRegisterState,
            company_name: e.target.value
        };
        this._emitChange(newState);
    }
    _emitChange(newState) {
        this.props.changeRegisterForm(newState);
    }
    render() {
        return (
            <Container text style={{paddingTop: 30}}>
                <Segment
                    color='black'
                    style={{
                    maxWidth: 450,
                    margin: '0 auto'
                }}>
                    <Header as='h2'>Đăng ký</Header>
                    {(( this.state.companynameValid === false ||
                        this.state.emailValid === false || 
                        this.state.usernameValid === false || 
                        this.state.passwordValid === false || 
                        this.state.confirmPasswordValid === false) && this.state.submitSignup)
                        ? <Message key={"1"}
                                error
                                header='There was some errors with your submission'
                                list={[this.state.emailErrorMessage, this.state.usernameErrorMessage, this.state.passwordErrorMessage, this.state.confirmPasswordErrorMessage, this.state.companynameErrorMessage]}/>
                        : ''}
                    {(this.props.data.errorMessage && this.state.companynameValid && this.state.emailValid && this.state.usernameValid && this.state.passwordValid && this.state.confirmPasswordValid && this.state.submitSignup)
                        ? <Message key={"2"}
                                error
                                header='There was some errors with your submission'
                                list={[this.props.data.errorMessage]}/>
                        : ''}
                    <Form
                        onSubmit={this._handleSignup}>
                        <Form.Field>
                            <Form.Input label="Tên công ty" type="text" id="company" placeholder='demo' onChange={this._changeCompanyName} onBlur={this._checkCompanyName} required/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Email" type="email" id="email" placeholder='example@gmail.com' onChange={this._changeEmail} required/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Tên định danh" type="text" id="username" placeholder='donguyen' onChange={this._changeUsername} required/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Mật khẩu" type="password" id="password" placeholder='••••••••••' onChange={this._changePassword} required/>
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Xác nhận lại mật khẩu" type="password" id="confirm_password" placeholder='••••••••••' onChange={this._changeConfirmPassword} required/>
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='Tôi đồng ý với Điều khoản và Điều lệ của Website'/>
                        </Form.Field> 
                        {(this.props.data.currentlySending)
                            ? <Button basic loading>Đang tải</Button>
                            : <Button basic type='submit'>Đăng ký</Button>}
                    </Form>
                </Segment>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        data: state.authReducer
    };
}

const mapDispatchToProps = {
    register,
    changeRegisterForm
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);