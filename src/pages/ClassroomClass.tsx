import React from 'react';

import { Col, Container, Row, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import Countdown from "react-countdown";

//import config from '../config';
import Api from '../api/backend';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type classroom = {
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    created_at: number,
}

type classroom_class = {
    id: number,
    classroom_id: number,
    start_time: number,
    start_time_actual: number,
    end_time_actual: number,
    duration: number,
    created_at: number,
    class_hash: string
}

type ClassroomClassState = {
    class_hash: string,
    this_class: classroom_class | null,
    this_classroom: classroom | null,
    waiting_for_class_authorization: boolean
}

type ClassroomClassProps = {
    onAlert: Function,
    match: any,
    user_authentication: userAuthenticationType | null,
    user_authorization_check_complete: boolean,
}

export class ClassroomClass extends React.Component<ClassroomClassProps, ClassroomClassState> {
    constructor(props: ClassroomClassProps) {
        super(props);
        this.state = {
            class_hash: this.props.match.params.class_hash,
            this_class: null,
            this_classroom: null,
            waiting_for_class_authorization: true,
        };
    }

    authorizeAndEnterClass() {
        Api.get('/enter_class?class_hash=' + this.state.class_hash).then((response) => {
            if (response.data.class_id) {
                this.setState({
                    this_class: {
                        id: response.data.class_id,
                        classroom_id: response.data.classroom_id,
                        start_time: response.data.start_time,
                        start_time_actual: response.data.start_time_actual,
                        end_time_actual: response.data.end_time_actual,
                        duration: response.data.duration,
                        created_at: response.data.class_created_at,
                        class_hash: this.state.class_hash
                    },
                    this_classroom: {
                        id: response.data.classroom_id,
                        name: response.data.name,
                        description: response.data.description,
                        is_active: response.data.is_active,
                        created_at: response.data.classroom_created_at,
                    },
                    waiting_for_class_authorization: false,
                }, () => {
                    console.log("got class", this.state.this_class, this.state.this_classroom)
                })
            }
            else {
                this.setState({
                    waiting_for_class_authorization: false
                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                waiting_for_class_authorization: false
            });
            this.props.onAlert({ alert_type: "warning", alert_text: "Class does not exist or you don't have access to this class" });
        });
    }

    fetchClass() {
        if(this.props.user_authorization_check_complete && this.state.waiting_for_class_authorization){
            this.authorizeAndEnterClass();
        }
    }

    startClass = () => {
        if (this.state.this_class) {
            let new_class: classroom_class = this.state.this_class;
            Api.get('/start_class?class_hash=' + this.state.class_hash).then((response) => {
                console.log("class started", response)
                new_class.start_time_actual = new Date().getTime();
                this.setState({
                    this_class: new_class
                })
            })
        }
    }

    endClass = () => {
        if (this.state.this_class) {
            let new_class: classroom_class = this.state.this_class;
            Api.get('/end_class?class_hash=' + this.state.class_hash).then((response) => {
                console.log("class ended", response)
                new_class.end_time_actual = new Date().getTime();
                this.setState({
                    this_class: new_class
                })
            })
        }
    }

    renderDuringClass() {
        console.log("DuringClass")
        return (
            <Container fluid>
                <Row>
                    <Col xs="8">
                        <Row className="justify-content-md-center">
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Header as="h5" >Chessboard Area</Card.Header>
                                <Card.Body>
                                    chessboard placeholder
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Header as="h5" >Class Controls</Card.Header>
                                <Card.Body>
                                    <Button variant="dark" block onClick={this.endClass}>
                                        End
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                    <Col xs="4">
                        <Row className="justify-content-md-center">
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Header as="h5" >Video Area</Card.Header>
                                <Card.Body>
                                    Video placeholder
                                </Card.Body>
                            </Card>
                        </Row>
                        <Row className="justify-content-md-center">
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Header as="h5" >Chat Area</Card.Header>
                                <Card.Body>
                                    Chat placeholder
                                </Card.Body>
                            </Card>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }

    countdownComplete() {
        if (this.props.user_authentication?.user_type === 'coach') {
            let start_time: Date = new Date();
            if (this.state.this_class) {
                start_time = new Date(this.state.this_class?.start_time);
            }
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">You can start the class now</Card.Header>
                        <Card.Body>
                            <Card.Title>{this.state.this_classroom?.name}</Card.Title>
                            <Card.Text>
                                {this.state.this_classroom?.description}
                            </Card.Text>
                            <Button variant="dark" block onClick={this.startClass}>
                                Start
                            </Button>
                        </Card.Body>
                        <ListGroup className="list-group-flush" >
                            <ListGroupItem >
                                Scheduled Date: {start_time.toLocaleDateString()}
                            </ListGroupItem>
                            <ListGroupItem >
                                Scheduled Time: {start_time.toLocaleTimeString()}
                            </ListGroupItem>
                            <ListGroupItem >
                                Duration: {this.state.this_class?.duration} {"minutes"}
                            </ListGroupItem>
                        </ListGroup>
                        <Card.Footer className="text-muted">
                            Time Left: {"00:00:00"}
                        </Card.Footer>
                    </Card>
                </Container>
            );
        }
        else {
            let start_time: Date = new Date();
            if (this.state.this_class) {
                start_time = new Date(this.state.this_class?.start_time);
            }
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">This class will start soon</Card.Header>
                        <Card.Body>
                            <Card.Title>{this.state.this_classroom?.name}</Card.Title>
                            <Card.Text>
                                {this.state.this_classroom?.description}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush" >
                            <ListGroupItem >
                                Scheduled Date: {start_time.toLocaleDateString()}
                            </ListGroupItem>
                            <ListGroupItem >
                                Scheduled Time: {start_time.toLocaleTimeString()}
                            </ListGroupItem>
                            <ListGroupItem >
                                Duration: {this.state.this_class?.duration} {"minutes"}
                            </ListGroupItem>
                        </ListGroup>
                        <Card.Footer className="text-muted">
                            Time Left: {"00:00:00"}
                        </Card.Footer>
                    </Card>
                </Container>
            );
        }
    }

    renderPreClass() {
        console.log("PreClass")
        let start_time: Date = new Date();
        let class_wait_time: number
        if (this.state.this_class) {
            class_wait_time = (this.state.this_class.start_time - new Date().getTime());
            start_time = new Date(this.state.this_class?.start_time);
        }
        else {
            class_wait_time = Infinity;
        }
        type rendererType = {
            hours: number,
            minutes: number,
            seconds: number,
            completed: boolean
        }
        const renderer = ({ hours, minutes, seconds, completed }: rendererType) => {
            if (completed) {
                return this.countdownComplete()
            }
            else {
                return (
                    <Container>
                        <Card bg="light" style={{ marginTop: '1em' }}>
                            <Card.Header as="h5">This class hasn't started yet</Card.Header>
                            <Card.Body>
                                <Card.Title>{this.state.this_classroom?.name}</Card.Title>
                                <Card.Text>
                                    {this.state.this_classroom?.description}
                                </Card.Text>
                            </Card.Body>
                            <ListGroup className="list-group-flush" >
                                <ListGroupItem >
                                    Scheduled Date: {start_time.toLocaleDateString()}
                                </ListGroupItem>
                                <ListGroupItem >
                                    Scheduled Time: {start_time.toLocaleTimeString()}
                                </ListGroupItem>
                                <ListGroupItem >
                                    Duration: {this.state.this_class?.duration} {"minutes"}
                                </ListGroupItem>
                            </ListGroup>
                            <Card.Footer className="text-muted">
                                Time Left: {(hours > 9) ? hours : ("0" + hours)}:{(minutes > 9) ? minutes : ("0" + minutes)}:{(seconds > 9) ? seconds : ("0" + seconds)}
                            </Card.Footer>
                        </Card>
                    </Container>
                );
            }
        };
        return (<Countdown date={Date.now() + class_wait_time} renderer={renderer} />);
    }

    renderPostClass() {
        console.log("PostClass")
        let start_time = new Date()
        let end_time = new Date();
        if (this.state.this_class) {
            start_time = new Date(this.state.this_class?.start_time_actual);
            end_time = new Date(this.state.this_class?.end_time_actual);
        }
        return (

            <Container>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as="h5">Class Over</Card.Header>
                    <Card.Body>
                        <Card.Title>{this.state.this_classroom?.name}</Card.Title>
                        <Card.Text>
                            {this.state.this_classroom?.description}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush" >
                        <ListGroupItem >
                            Start: {start_time.toLocaleString()}
                        </ListGroupItem>
                        <ListGroupItem >
                            End: {end_time.toLocaleString()}
                        </ListGroupItem>
                        <ListGroupItem >
                            Duration: {this.state.this_class?.duration} {"minutes"}
                        </ListGroupItem>
                    </ListGroup>
                    <Card.Footer className="text-muted">
                        We hope you enjoyed the class
                    </Card.Footer>
                </Card>
            </Container>
        );
    }

    render() {
        this.fetchClass();
        if (this.state.waiting_for_class_authorization && !this.props.user_authorization_check_complete) {
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">Loading</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Class loading
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
        else {
            if(!this.props.user_authentication){
                return (<Redirect to='/' />);
            }
            if (this.state.this_class) {
                if (this.state.this_class.start_time_actual && !this.state.this_class.end_time_actual) {
                    return this.renderDuringClass();
                }
                else if (this.state.this_class.start_time_actual && this.state.this_class.end_time_actual) {
                    return this.renderPostClass();
                }
                else if (!this.state.this_class.start_time_actual && !this.state.this_class.end_time_actual) {
                    return this.renderPreClass();
                }
                else {
                    console.log("invalid timings from DB", this.state.this_class)
                    return (
                        <Container>
                            INVALID TIMINGS
                        </Container>
                    )
                }
            }
            else {
                console.log("unauthorized")
                return (
                    <Container>
                        <Card bg="light" style={{ marginTop: '1em' }}>
                            <Card.Header as="h5">Unauthorized</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    Class unavailable
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Container>
                );
            }
        }
    }
}