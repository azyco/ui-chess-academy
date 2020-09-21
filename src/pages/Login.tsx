import React from 'react';
import { Container, Form, Button,Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import CryptoJS from 'crypto-js';

import Api from '../api/backend';
import config from '../config';

type LoginProps = {
    onLogin: any,//check type for callback functions
    onAlert: Function
}

type LoginState = {
    email: string,
    password: string,
    redirect_to: string,
}

export class Login extends React.Component<LoginProps,LoginState> {
    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect_to: 'login',
        };
    }
    /*
    bad login results in server down error
    */
    handleLoginClick = ()=>{
        const password_hash = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex);
        Api.post('/login', {email: this.state.email, password_hash: password_hash}).then((response) => {
            if(response.data){
                console.log("Logged In: ", response);
                this.props.onLogin(response.data);
                this.setState({redirect_to:'profile'})
                this.props.onAlert({alert_type:"success",alert_text:config.loginSuccessfulText})
            }
            else{
                console.log("Bad data from server")
                this.props.onAlert({alert_type:"warning",alert_text:config.serverDownAlertText})
            }
        }).catch((error)=>{
            console.log(error.response)
            if(error.response.data.error_type==='login_credentials'){
                this.props.onAlert({alert_type:"warning",alert_text:config.badLoginAlertText})
            }
            else if(error.response.data.error_type==='database'){
                this.props.onAlert({alert_type:"warning",alert_text:config.serverDownAlertText})
            }
        });
    }
    
    onEmailChange = (ev: any) => {
        this.setState({email: ev.target.value});
    }

    onPasswordChange = (ev: any) => {
        this.setState({password: ev.target.value});
    }

    renderRedirect = () => {
        if (this.state.redirect_to === 'profile') {
            return <Redirect to='/profile' />
        }
    }

    render()
    {
        return (
            <Container >
                {this.renderRedirect()}
                <Card bg="light" style={{marginTop:'2em'}}>
                    <Card.Header>{config.loginText}</Card.Header>
                    <Card.Body>
                        <Form>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Control onChange={this.onEmailChange} value={this.state.email} type="email" placeholder={config.emailPlaceholderText} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                        <Form.Control onChange={this.onPasswordChange} value={this.state.password} type="password" placeholder={config.passwordPlaceholderText} />
                        </Form.Group>
                            <Button onClick={this.handleLoginClick} className="float-right" variant="dark">
                                {config.loginText}
                            </Button>
                        </Form>
                        </Card.Body>
                </Card>
            </Container>
        );
    }
}
