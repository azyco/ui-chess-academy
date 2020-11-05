import React from 'react';

import { Col, Container, Row, Card, Button, ListGroup, ListGroupItem } from 'react-bootstrap';
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
    waiting_for_authorization: boolean
}

type ClassroomClassProps = {
    onAlert: Function,
    match: any,
    user_authentication: userAuthenticationType | null
}

export class ClassroomClass extends React.Component<ClassroomClassProps, ClassroomClassState> {
    constructor(props: ClassroomClassProps) {
        super(props);
        this.state = {
            class_hash: this.props.match.params.class_hash,
            this_class: null,
            this_classroom: null,
            waiting_for_authorization: true
        };
    }

    authorizeAndEnterClass() {
        Api.get('/enter_class?class_hash=' + this.state.class_hash).then((response) => {
            console.log(response);
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
                    waiting_for_authorization: false
                }, () => {
                    console.log("got class", this.state.this_class, this.state.this_classroom)
                })
            }
            else {
                this.setState({
                    waiting_for_authorization: false
                });
            }
        }).catch((error) => {
            console.log(error);
            this.setState({
                waiting_for_authorization: false
            });
            this.props.onAlert({ alert_type: "warning", alert_text: "Class does not exist or you don't have access to this class" });
        });
    }

    componentDidMount() {
        this.authorizeAndEnterClass();
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
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">You can start the class now</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                <Button variant="dark" block onClick={this.startClass}>
                                    Start
                                </Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
        else {
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5">This class will start soon</Card.Header>
                        <Card.Body>
                            <Card.Text>
                                Please wait for the coach to start the class
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Container>
            );
        }
    }

    renderPreClass() {
        console.log("PreClass")
        let class_wait_time: number
        if (this.state.this_class) {
            class_wait_time = (this.state.this_class.start_time - new Date().getTime());
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
                                <Card.Title>Time Left:</Card.Title>
                                <Card.Text>
                                    {(hours > 9) ? hours : ("0" + hours)}:{(minutes > 9) ? minutes : ("0" + minutes)}:{(seconds > 9) ? seconds : ("0" + seconds)}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Container>
                );
            }
        };
        return (<Countdown date={Date.now() + class_wait_time} renderer={renderer} />);
    }

    renderPostClass() {
        console.log("PostClass")
        let start_time
        let end_time
        if (this.state.this_class) {
            start_time = new Date(this.state.this_class?.start_time_actual).toLocaleString();
            end_time = new Date(this.state.this_class?.end_time_actual).toLocaleString();
        }
        return (
            <Container>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as="h5">Class Over</Card.Header>
                    <Card.Body>
                        The class is over.
                        The summary is written below.
                    </Card.Body>
                    <ListGroup className="list-group-flush" >
                        <ListGroupItem >
                            Classroom Name: {this.state.this_classroom?.name}
                        </ListGroupItem>
                        <ListGroupItem >
                            Classroom Description: {this.state.this_classroom?.description}
                        </ListGroupItem>
                        <ListGroupItem >
                            Start Time: {start_time}
                        </ListGroupItem>
                        <ListGroupItem >
                            End Time: {end_time}
                        </ListGroupItem>
                    </ListGroup>
                </Card>
            </Container>
        );
    }

    render() {
        if (this.state.waiting_for_authorization) {
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