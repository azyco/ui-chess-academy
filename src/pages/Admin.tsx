import React from 'react';

import {
    Container,
    Button,
    Row, Col,
    Nav, Tab,
    Card,
    Table,
    Form
} from 'react-bootstrap';

import config from '../config';
import Api from '../api/backend';

type AdminProps = {
    onAlert: Function,
    onLogout: any,
    user_authentication: userAuthenticationType
}

type classroom = {
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    created_at: Date
}

type user = {
    id: number,
    email: string,
    user_type: string,
    fullname: string
}

type AdminState = {
    classroom_array: classroom[],
    student_array: (user | null)[],
    student_array_selected: (user | null)[],
    coach_array: (user | null)[],
    coach_array_selected: (user | null)[],
    selected_source_student_array_index: number,
    selected_destination_student_array_index: number,
    selected_source_coach_array_index: number,
    selected_destination_coach_array_index: number,
    classroom_name: string,
    classroom_description: string,
}

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
}

export class Admin extends React.Component<AdminProps, AdminState>{
    constructor(props: AdminProps) {
        super(props);
        this.state = {
            classroom_array: [],
            student_array: [],
            student_array_selected: [],
            coach_array: [],
            coach_array_selected: [],
            selected_source_student_array_index: -1,
            selected_destination_student_array_index: -1,
            selected_source_coach_array_index: -1,
            selected_destination_coach_array_index: -1,
            classroom_name: '',
            classroom_description: '',
        };
        this.updateClassroomArray();
        this.updateStudentArray();
        this.updateCoachArray();
    }

    updateClassroomArray() {
        Api.get('/classroom').then((response) => {
            console.log(response);
            this.setState({ classroom_array: response.data.classrom_array });
        }).catch((error) => {
            console.log("failed to update classroom array");
        });
    }

    updateStudentArray() {
        Api.get('/student').then((response) => {
            console.log(response);
            this.setState({
                student_array: response.data.student_array,
                student_array_selected: new Array(response.data.student_array.length).fill(null)
            });
        }).catch((error) => {
            console.log("failed to update student array");
        });
    }

    updateCoachArray() {
        Api.get('/coach').then((response) => {
            console.log(response);
            this.setState({
                coach_array: response.data.coach_array,
                coach_array_selected: new Array(response.data.coach_array.length).fill(null)
            });
        }).catch((error) => {
            console.log("failed to update coach array");
        });
    }

    userOptionGenerator = (user_option: user | null, index: number) => (
        <option key={index} value={index}>
            {user_option?.fullname}
        </option>
    );

    classroomRowGenerator = (classrom_row: classroom) => (
        <tr key={classrom_row.id} >
            <td>{classrom_row.id}</td>
            <td>{classrom_row.name}</td>
            <td>{classrom_row.description}</td>
            <td>{classrom_row.is_active}</td>
            <td>{classrom_row.created_at}</td>
        </tr>
    );

    renderClassroomTable() {
        if (this.state.classroom_array) {
            return (
                <Table striped bordered hover responsive="md" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Active</th>
                            <th>Creation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.classroom_array.map(this.classroomRowGenerator)}
                    </tbody>
                </Table>);
        }
        else {
            return (
                <div>
                    No Classrooms present
                </div>
            )
        }

    }

    onClassroomNameChange = (ev: any) => {
        this.setState({
            classroom_name: ev.target.value
        });
    }

    onClassroomDescriptionChange = (ev: any) => {
        this.setState({
            classroom_description: ev.target.value
        });
    }

    onSelectedSourceStudentChange = (ev: any) => {
        this.setState({
            selected_source_student_array_index: ev.target.value
        });
    }

    onSelectedDestinationStudentChange = (ev: any) => {
        this.setState({
            selected_destination_student_array_index: ev.target.value
        });
    }

    addSelectedStudentID = () => {
        if (this.state.selected_source_student_array_index !== -1) {
            let std_arr_in = this.state.student_array;
            let std_arr_out = this.state.student_array_selected;
            console.log("before");
            console.log("std_arr_in: ", this.state.student_array);
            console.log("std_arr_out: ", this.state.student_array_selected);
            std_arr_out[this.state.selected_source_student_array_index] = this.state.student_array[this.state.selected_source_student_array_index];
            std_arr_in[this.state.selected_source_student_array_index] = null;
            this.setState({
                student_array: std_arr_in,
                student_array_selected: std_arr_out,
                selected_source_student_array_index: -1
            },
                () => {
                    console.log("after");
                    console.log("std_arr_in: ", this.state.student_array);
                    console.log("std_arr_out: ", this.state.student_array_selected);
                });
        }
        else {
            this.props.onAlert({ alert_type: "warning", alert_text: "You need to select something first" });
        }
    }

    removeSelectedStudentID = () => {
        if (this.state.selected_destination_student_array_index !== -1) {
            let std_arr_in = this.state.student_array;
            let std_arr_out = this.state.student_array_selected;
            console.log("before");
            console.log("std_arr_in: ", this.state.student_array);
            console.log("std_arr_out: ", this.state.student_array_selected);
            std_arr_in[this.state.selected_destination_student_array_index] = this.state.student_array_selected[this.state.selected_destination_student_array_index];
            std_arr_out[this.state.selected_destination_student_array_index] = null;
            this.setState({
                student_array: std_arr_in,
                student_array_selected: std_arr_out,
                selected_destination_student_array_index: -1
            },
                () => {
                    console.log("after");
                    console.log("std_arr_in: ", std_arr_in);
                    console.log("std_arr_out: ", std_arr_out);
                });
        }
        else {
            this.props.onAlert({ alert_type: "warning", alert_text: "You need to select something first" });
        }
    }

    onSelectedSourceCoachChange = (ev: any) => {
        this.setState({
            selected_source_coach_array_index: ev.target.value
        });
    }

    onSelectedDestinationCoachChange = (ev: any) => {
        this.setState({
            selected_destination_coach_array_index: ev.target.value
        }, () => {
            console.log(this.state.selected_destination_coach_array_index);
        });
    }

    countSelectedUsers(user_array: (user | null)[]) {
        const new_arr = user_array.filter((value, index, array) => { if (value) { return value; } })
        return new_arr.length;
    }

    addSelectedCoachID = () => {
        if (this.state.selected_source_coach_array_index !== -1) {
            if (this.countSelectedUsers(this.state.coach_array_selected) < 1) {
                let std_arr_in = this.state.coach_array;
                let std_arr_out = this.state.coach_array_selected;
                std_arr_out[this.state.selected_source_coach_array_index] = this.state.coach_array[this.state.selected_source_coach_array_index];
                std_arr_in[this.state.selected_source_coach_array_index] = null;
                this.setState({
                    coach_array: std_arr_in,
                    coach_array_selected: std_arr_out,
                    selected_source_coach_array_index: -1
                });
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: "You can't add more than 1 coach" });
            }
        }
        else {
            this.props.onAlert({ alert_type: "warning", alert_text: "You need to select something first" });
        }
    }

    removeSelectedCoachID = () => {
        if (this.state.selected_destination_coach_array_index !== -1) {
            let std_arr_in = this.state.coach_array;
            let std_arr_out = this.state.coach_array_selected;
            std_arr_in[this.state.selected_destination_coach_array_index] = this.state.coach_array_selected[this.state.selected_destination_coach_array_index];
            std_arr_out[this.state.selected_destination_coach_array_index] = null;
            this.setState({
                coach_array: std_arr_in,
                coach_array_selected: std_arr_out,
                selected_destination_coach_array_index: -1
            });
        }
        else {
            this.props.onAlert({ alert_type: "warning", alert_text: "You need to select something first" });
        }
    }

    renderStudentSelect() {
        if (this.state.student_array) {
            return (
                <Form.Row>
                    <Col md={6}>
                        <Form.Group controlId="student_select_source">
                            <Form.Label>Available Students</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedSourceStudentChange}>
                                {this.state.student_array.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button block onClick={this.addSelectedStudentID}>
                                Add
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="student_select_sink">
                            <Form.Label>Selected Students</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedDestinationStudentChange}>
                                {this.state.student_array_selected.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button block onClick={this.removeSelectedStudentID}>
                                Remove
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            );
        }
        else {
            return (
                <Container>
                    No Students added
                </Container>
            );
        }
    }

    renderCoachSelect() {
        if (this.state.coach_array) {
            return (
                <Form.Row>
                    <Col md={6}>
                        <Form.Group controlId="coach_select_source">
                            <Form.Label>Available Coaches</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedSourceCoachChange}>
                                {this.state.coach_array.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button block onClick={this.addSelectedCoachID}>
                                Add
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="coach_select_sink">
                            <Form.Label>Selected Coaches</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedDestinationCoachChange}>
                                {this.state.coach_array_selected.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button block onClick={this.removeSelectedCoachID}>
                                Remove
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            );
        }
        else {
            return (
                <Container>
                    No Coaches added
                </Container>
            );
        }
    }

    createClassroom = () => {
        console.log(this.state);
        const coach_array_selected_filtered = this.state.coach_array_selected.filter((value, index, array) => { if (value) { return value; } });
        const student_array_selected_filtered = this.state.student_array_selected.filter((value, index, array) => { if (value) { return value; } });
        Api.post('/classroom', {
            classroom_data: {
                classroom_name: this.state.classroom_name,
                classroom_description: this.state.classroom_description,
                student_array_selected: student_array_selected_filtered,
                coach_array_selected: coach_array_selected_filtered,
                is_active: true
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "Class added Successfully" });
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                if (error.response.data.error_code === 'ER_DUP_ENTRY') {
                    this.props.onAlert({ alert_type: "warning", alert_text: "Classroom name alreaady exists" });
                }
                else {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                }
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    renderClassroomTab() {
        return (
            <Container fluid>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Classrooms</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            {this.renderClassroomTable()}
                        </Container>
                    </Card.Body>
                </Card>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Add Classroom</Card.Header>
                    <Card.Body>
                        <Container>
                            <Form>
                                <Form.Row>
                                    <Form.Group md={6} as={Col}>
                                        <Form.Label>Classroom Name</Form.Label>
                                        <Form.Control placeholder="Classroom Name" onChange={this.onClassroomNameChange} />
                                    </Form.Group>
                                    <Form.Group md={6} as={Col}>
                                        <Form.Label>Classroom Description</Form.Label>
                                        <Form.Control type="textarea" placeholder="Classroom Description" onChange={this.onClassroomDescriptionChange} />
                                    </Form.Group>
                                </Form.Row>
                                {this.renderStudentSelect()}
                                {this.renderCoachSelect()}
                            </Form>
                        </Container>
                        <Button block onClick={this.createClassroom}>
                            Done
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }

    render() {
        return (
            <Container fluid >
                <Tab.Container id="left-tabs-example" defaultActiveKey="classroom">
                    <Row>
                        <Col lg={2}>
                            <Card bg="light" style={{ marginTop: '1em' }}>
                                <Card.Body>
                                    <Nav variant="pills" className="flex-column" >
                                        <Nav.Item>
                                            <Nav.Link eventKey="classroom">Classroom Management</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="coach">Coach Management</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="profile">Profile Management</Nav.Link>
                                        </Nav.Item>
                                        <Button variant={"warning"} onClick={this.props.onLogout} >
                                            Logout
                                        </Button>
                                    </Nav>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col lg={10}>
                            <Tab.Content>
                                <Tab.Pane eventKey="classroom">
                                    {this.renderClassroomTab()}
                                </Tab.Pane>
                                <Tab.Pane eventKey="coach">
                                    <Card bg="light" style={{ marginTop: '1em' }}>
                                        <Card.Header as='h5'>Coach Management</Card.Header>
                                        <Card.Body>
                                            Update Coaches
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                                <Tab.Pane eventKey="profile">
                                    <Card bg="light" style={{ marginTop: '1em' }}>
                                        <Card.Header as='h5'>Update Profile</Card.Header>
                                        <Card.Body>
                                            Update Profiles
                                        </Card.Body>
                                    </Card>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </Container>
        )
    }
}
