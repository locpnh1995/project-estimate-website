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
import {login, changeLoginForm} from './AuthActions';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            emailErrorMessage: '',
            passwordErrorMessage: '',
            emailValid: '',
            passwordValid: '',
            submitSignin: false
        };
        this._changeEmail = this
            ._changeEmail
            .bind(this);
        this._changePassword = this
            ._changePassword
            .bind(this);
        this._handleSignin = this
            ._handleSignin
            .bind(this);
        this._emitChange = this
            ._emitChange
            .bind(this);

        this._emitChange( { ...this.props.data.formLoginState, company_name: this.props.match.params.company } );
    }
    _handleSignin(e) {
        e.preventDefault();
        this.setState({submitSignin: true});
        if(this.state.emailValid && this.state.passwordValid) {
            this
                .props
                .login(this.props.data.formLoginState.email, this.props.data.formLoginState.password, this.props.data.formLoginState.company_name)
                .then(response => {
                    if (response && response.success) {
                        this
                            .props
                            .history
                            .push(this.props.match.url + '/dashboard');
                    }
                });
        }    
    }
    _changeEmail(e) {
        this.setState({submitSignin: false});
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
            ...this.props.data.formLoginState,
            email: e.target.value
        };
        this._emitChange(newState);
    }
    _changePassword(e) {
        this.setState({submitSignin: false});
        var regex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])[0-9a-zA-Z!@#$%^&*]{8,50}$/;
        if(regex.test(e.target.value)) {
            this.setState({
                passwordValid: regex.test(e.target.value),
                passwordErrorMessage: ''
            });
        }
        else {
            this.setState({
                passwordValid: regex.test(e.target.value),
                passwordErrorMessage: 'Your password must contain at least 8 characters, including UPPER/lowercase, number and special characters'
            });
        }
        var newState = {
            ...this.props.data.formLoginState,
            password: e.target.value
        };
        this._emitChange(newState);
    }
    _emitChange(newState) {
        this.props.changeLoginForm(newState);
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
                    <Header as='h2'>Đăng nhập</Header>
                    {((this.state.emailValid === false || this.state.passwordValid === false) && this.state.submitSignin)
                        ? <Message key={"1"}
                                error
                                header='There was some errors with your submission'
                                list={[this.state.emailErrorMessage, this.state.passwordErrorMessage]}/>
                        : ''}
                    {(this.props.data.errorMessage && this.state.emailValid && this.state.passwordValid && this.state.submitSignin)
                        ? <Message key={"2"}
                                error
                                header='There was some errors with your submission'
                                list={[this.props.data.errorMessage]}/>
                        : ''}
                    <Form onSubmit={this._handleSignin}>
                        <Form.Field>
                            <Form.Input
                                label="Email"
                                type="email"
                                id="email"
                                placeholder='example@gmail.com'
                                onChange={this._changeEmail}
                                required />
                        </Form.Field>
                        <Form.Field>
                            <Form.Input
                                label="Mật khẩu"
                                type="password"
                                id="password"
                                placeholder='••••••••••'
                                onChange={this._changePassword}
                                required />
                        </Form.Field>
                        <Form.Field>
                            <Checkbox label='Duy trì đăng nhập'/>
                        </Form.Field>
                        {(this.props.data.currentlySending)
                            ? <Button basic loading>Đang tải</Button>
                            : <Button basic type='submit'>Đăng nhập</Button>}
                    </Form>
                </Segment>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {data: state.authReducer};
}

const mapDispatchToProps = {
    login,
    changeLoginForm
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);