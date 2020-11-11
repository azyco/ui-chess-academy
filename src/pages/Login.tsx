import React from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import CryptoJS from 'crypto-js';

import Api from '../api/backend';
import config from '../config';

type LoginProps = {
    onLogin: any,//check type for callback functions
    onAlert: Function,
    is_logged_in: boolean,
    user_authorization_check_complete: boolean,
    got_auth_and_profile: boolean
}

type LoginState = {
    email: string,
    password: string,
    redirect_to: string,
    email_is_invalid: boolean,
    password_is_invalid: boolean,
    isLoading: boolean,
    got_auth: boolean
}

export class Login extends React.Component<LoginProps, LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect_to: 'login',
            email_is_invalid: false,
            password_is_invalid: false,
            isLoading: false,
            got_auth: false
        };
    }

    isLoginDisabled() {
        return this.state.email.length === 0 || this.state.email_is_invalid || this.state.password.length === 0 || this.state.password_is_invalid || this.state.got_auth;
    }

    handleLoginClick = () => {
        this.setState({ isLoading: true }, () => {
            const password_hash = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex);
            Api.post('/login', { email: this.state.email, password_hash: password_hash }).then((response) => {
                this.setState({ isLoading: false }, () => {
                    if (response.data) {
                        console.log("Logged In: ", response);
                        this.props.onLogin(response.data);
                        this.setState({
                            redirect_to: 'profile',
                            got_auth: true
                        }, () => {
                            this.props.onAlert({ alert_type: "success", alert_text: config.loginSuccessfulText })
                        });
                    }
                    else {
                        console.log("Bad data from server");
                        this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                    }
                })
            }).catch((error) => {
                this.setState({ isLoading: false }, () => {
                    console.log(error);
                    if (error.response) {
                        if (error.response.data.error_type === 'login_credentials') {
                            this.props.onAlert({ alert_type: "warning", alert_text: config.badLoginAlertText });
                        }
                        else if (error.response.data.error_type === 'database') {
                            this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                        }
                    }
                    else {
                        this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                    }
                })
            })
        });
    }

    onEmailChange = (ev: any) => {
        const valid_test = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(ev.target.value);
        this.setState({ email: ev.target.value, email_is_invalid: !valid_test });
    }

    onPasswordChange = (ev: any) => {
        this.setState({ password: ev.target.value, password_is_invalid: !ev.target.value });
    }

    renderRedirect = () => {
        if ((this.state.redirect_to === 'profile' && this.props.got_auth_and_profile) || this.props.is_logged_in) {
            console.log("redirecting to profile ")
            return <Redirect to='/profile' />
        }
    }

    render() {
        if (!this.props.user_authorization_check_complete) {
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5" >Loading</Card.Header>
                        <Card.Body>
                            Please Wait
                    </Card.Body>
                    </Card>
                </Container>
            )
        }
        else {
            return (
                <Container>
                    {this.renderRedirect()}
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">{config.loginText}</Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Control onChange={this.onEmailChange} value={this.state.email} type="email" placeholder={config.emailPlaceholderText} isInvalid={this.state.email_is_invalid} />
                                    <Form.Control.Feedback type="invalid">
                                        {config.emailInvalidFeedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Control onChange={this.onPasswordChange} value={this.state.password} type="password" placeholder={config.passwordPlaceholderText} isInvalid={this.state.password_is_invalid} />
                                    <Form.Control.Feedback type="invalid">
                                        {config.loginPasswordInvalidFeedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Button onClick={this.handleLoginClick} className="float-right" variant="dark" disabled={this.isLoginDisabled()}>
                                    {config.loginText}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
    }
}
