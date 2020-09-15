import React from 'react';
import Api from '../api/backend';
import { Container, Form, Button, Card } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

interface IRegisterState {
    email:   string;
    password:  string;
    registerButtonEnabled: boolean;
}


export class RegisterStudent extends React.Component<any, IRegisterState> {
    constructor(props: any) {
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
                <Card bg="light">
                    <Card.Header>Student Registration</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control value={this.state.email} onChange={this.onEmailChange} type="email" placeholder="Enter email" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control value={this.state.password} onChange={this.onPasswordChange} type="password" placeholder="Password" />
                            </Form.Group>
                            <Button disabled={!this.state.registerButtonEnabled} onClick={this.handleRegister} variant="dark">
                                Register
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
  