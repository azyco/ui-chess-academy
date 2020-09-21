import React from 'react';
import Api from '../../api/backend';
import config from '../../config';

import { Container, Form, Button, Card } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterCoachProps = {
    onAlert: Function
}

type RegisterCoachState = {
    email: string,
    password: string,
    registerButtonEnabled: boolean
}

export class RegisterCoach extends React.Component<RegisterCoachProps, RegisterCoachState> {
    constructor(props: RegisterCoachProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            registerButtonEnabled: true
        };
    }

    handleRegister = () => {
        const encryptedPassword = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex)
        Api.post('/coach', {email: this.state.email, password: encryptedPassword}).then((response) => {
            console.log(response);
            this.props.onAlert({alert_type:"success",alert_text:config.registrationSuccessfulText});
        });
        this.setState({ registerButtonEnabled: false });
    }

    onEmailChange = (ev: any) => {
        this.setState({email: ev.target.value});
    }

    onPasswordChange = (ev: any) => {
        this.setState({password: ev.target.value});
    }

    render()
    {
        return (
            <Container>
                <Card bg="light" style={{marginTop:'2em'}}>
                    <Card.Header>{config.coachRegistrationText}</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.onEmailChange} type="email" placeholder={config.emailPlaceholderText} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.onPasswordChange} type="password" placeholder={config.passwordPlaceholderText} />
                            </Form.Group>
                            <Button disabled={!this.state.registerButtonEnabled} className="float-right" onClick={this.handleRegister} variant="dark">
                                {config.registerText}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
  