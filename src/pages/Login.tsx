import React from 'react';
import { Container, Form, Button, Alert,Card } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import CryptoJS from 'crypto-js';

import Api from '../api/backend';
import config from '../config';

type LoginProps = {

}

type LoginState = {
    email: string,
    password: string,
    redirect_to: string,
    user_is_logged_in : boolean,
    render_alert: string 
}

export class Login extends React.Component<LoginProps,LoginState> {
    constructor(props: LoginState) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect_to: 'login',
            user_is_logged_in : false,
            render_alert:''
        };
        this.badLoginAlert.bind(this.state);
    }

    handleLoginClick = ()=>{
        const password_hash = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex);
        Api.post('/login', {email: this.state.email, password_hash: password_hash}).then((response) => {
            if(response.data.exists){
                this.setState({user_is_logged_in:true,redirect_to:'profile'})
            }
            else{
                this.setState({render_alert:'badlogin'})
            }
            console.log(response);
        },
        ()=>{
            console.log("Error connecting to server");
            this.setState({render_alert:'serverdown'})
        });
    }

    badLoginAlert(){
        if(this.state.render_alert==='badlogin'){
            return(
            <Alert variant="warning">
                {config.badLoginAlertText}
            </Alert>);
            }
        else if(this.state.render_alert==='serverdown'){
            return(
            <Alert variant="warning">
                {config.serverDownAlertText}
            </Alert>);
            }
        
    }
    
    onEmailChange = (ev: any) => {
        this.setState({email: ev.target.value});
    }

    onPasswordChange = (ev: any) => {
        this.setState({password: ev.target.value});
    }

    renderRedirect = () => {
        if (this.state.redirect_to === 'login') {
            return <Redirect to='/login' />
        }
        else if (this.state.redirect_to === 'profile') {
            return <Redirect to='/profile' />
        }
        else if (this.state.redirect_to === 'login') {
            return <Redirect to='/login' />
        }
        else if (this.state.redirect_to === 'profile') {
            return <Redirect to='/profile' />
        }
    }

    render()
    {
        return (
            <Container >
                {this.renderRedirect()}
                {this.badLoginAlert()}
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
                            <Button onClick={this.handleLoginClick} variant="dark">
                                {config.loginText}
                            </Button>
                        </Form>
                        </Card.Body>
                </Card>
            </Container>
        );
    }
}
