import React from 'react';
import Api from '../api/backend';
import config from '../config';

import { Container, Form, Button, Card } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterStudentProps = {

}

type RegisterStudentState = {
    email: string,
    password: string,
    registerButtonEnabled: boolean
}

export class RegisterStudent extends React.Component<RegisterStudentProps, RegisterStudentState> {
    constructor(props: RegisterStudentProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            registerButtonEnabled: true
        };
    }

    handleRegister = () => {
        const encryptedPassword = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex)
        Api.post('/register_student', {email: this.state.email, password: encryptedPassword}).then((response) => {
            console.log(response);
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
                    <Card.Header>{config.studentRegistrationText}</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.onEmailChange} type="email" placeholder={config.emailPlaceholderText} />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.onPasswordChange} type="password" placeholder={config.passwordPlaceholderText} />
                            </Form.Group>
                            <Button disabled={!this.state.registerButtonEnabled} onClick={this.handleRegister} variant="dark">
                                {config.registerText}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
  