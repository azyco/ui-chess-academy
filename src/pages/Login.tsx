import React from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import CryptoJS from 'crypto-js';

import Api from '../api/backend';

export class Login extends React.Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            email: "",
            password: "",
            redirect_to: 'login',
            user_is_logged_in : false,
            render_alert:false 
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
                this.setState({render_alert:true})
            }
            console.log(response);
        },
        ()=>{
            console.log("Error connecting to server");
        });
    }

    badLoginAlert(){
        if(this.state.render_alert)
        {
            return(
            <Alert variant="warning">
                Wrong E-Mail and/or Password
            </Alert>
        );
    }
        
    }
    
    onEmailChange = (ev: any) => {
        this.setState({email: ev.target.value});
    }

    onPasswordChange = (ev: any) => {
        this.setState({password: ev.target.value});
    }

    handleRegisterClick = () => {
        this.setState({ redirect_to: 'register' });
    }

    renderRedirect = () => {
        if (this.state.redirect_to === 'register') {
            return <Redirect to='/register' />
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
            <Container fluid="sm">
                {this.renderRedirect()}
                {this.badLoginAlert()}
                <Row>
                    <Col>
                        <h1>
                            Login
                        </h1>
                    </Col>            
                </Row>
                <Row>
                    <Col>
                        <Button size="lg" variant="primary" >
                            Login with Google
                        </Button>
                    </Col>  
                </Row>
                <Row>
                    <Col>
                        <Form>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control onChange={this.onEmailChange} value={this.state.email} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control onChange={this.onPasswordChange} value={this.state.password} type="password" placeholder="Password" />
                        </Form.Group>
                            <Button onClick={this.handleLoginClick} variant="primary">
                                Submit
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button onClick={this.handleRegisterClick} variant="secondary">
                                    Register
                        </Button>
                    </Col>
                </Row>
            </Container>
        );
    }
}
