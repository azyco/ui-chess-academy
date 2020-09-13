import React from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'

export class Login extends React.Component<any,any> {
    constructor(props: any) {
        super(props);
        this.state = {
            redirect_to_register: false
        };
    }

    handleClick = () => {
        this.setState({ redirect_to_register: true });
    }

    renderRedirect = () => {
        if (this.state.redirect_to_register) {
            return <Redirect to='/register' />
        }
    }

    render()
    {
        return (
            <Container fluid="sm">
                {this.renderRedirect()}
                <Row>
                    <Col>
                        <h1>
                            Login
                        </h1>
                    </Col>            
                </Row>
                <Row>
                    <Col>
                        <Button size="lg" variant="dark" >
                            Login with Google
                        </Button>
                    </Col>  
                </Row>
                <Row>
                    <Col>
                        <Form>
                        <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                        </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button onClick={this.handleClick}>
                                Register
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}
