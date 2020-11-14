import React from 'react';

import {
    Container, Col,
    Card,
    Table, Button, Collapse, Form
} from 'react-bootstrap';

import config from '../../config';
import Api from '../../api/backend';

type classroom = {
    id: number,
    name: string,
    description: string,
    student_count: number
}

type classroom_class = {
    id: number,
    classroom_id: number,
    start_time: number,
    duration: number,
    created_at: number,
    class_hash: string
}

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type ClassCoachProps = {
    onAlert: Function,
    user_authentication: userAuthenticationType,
    unauthorizedLogout: Function
}

type ClassCoachState = {
    classroom_array: classroom[],
    selected_classroom_id: number,
    selected_classroom_class_array: classroom_class[] | null,
    start_time_input: string,
    start_time: Date,
    start_time_is_invalid: boolean,
    duration: number,
    duration_is_invalid: boolean
}

export class ClassCoach extends React.Component<ClassCoachProps, ClassCoachState> {
    constructor(props: ClassCoachProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_id: -1,
            selected_classroom_class_array: null,
            start_time_input: '',
            start_time: new Date(),
            start_time_is_invalid: true,
            duration: 0,
            duration_is_invalid: true
        };
    }

    componentDidMount() {
        this.updateClassroomArray();
    }

    updateClassroomArray() {
        Api.get('/classroom?coach_id=' + this.props.user_authentication.id).then((response) => {
            console.log("classroom array updated ", response);
            this.setState({ classroom_array: Array.from(response.data.classroom_array) }, () => {
                console.log("state after classroom update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update classroom array ", error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    getClassArrayAndResetForm(classroom_id: number = this.state.selected_classroom_id) {
        Api.get('/class?classroom_id=' + classroom_id).then((response) => {
            console.log("got class array ", response);
            this.setState({
                selected_classroom_class_array: response.data,
                selected_classroom_id: classroom_id,
                start_time_input: '',
                start_time: new Date(),
                start_time_is_invalid: true,
                duration: 0,
                duration_is_invalid: true
            });
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    deleteClass(class_id: number, classroom_id: number) {
        Api.delete('/class?class_id=' + class_id + '&classroom_id=' + classroom_id).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "Class deleted successfully" });
            this.getClassArrayAndResetForm(this.state.selected_classroom_id);
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    addClass() {
        const start_time_db = this.state.start_time.valueOf();
        Api.post('/class', {
            class_details: {
                start_time: start_time_db,
                duration: this.state.duration,
                classroom_id: this.state.selected_classroom_id
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: "Class added successfully" });
            this.getClassArrayAndResetForm();
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    classroomRowGenerator = (classrom_row: classroom) => (
        <tr key={classrom_row.id} >
            <td>{classrom_row.id}</td>
            <td>{classrom_row.name}</td>
            <td>{classrom_row.description}</td>
            <td>{classrom_row.student_count}</td>
            <td>
                <Button variant="dark" onClick={() => { this.getClassArrayAndResetForm(classrom_row.id) }} disabled={this.state.selected_classroom_id === classrom_row.id}>
                    Select
                </Button>
            </td>
        </tr>
    );

    renderClassroomTable() {
        console.log("rendering classroom table");
        if (this.state.classroom_array && this.state.classroom_array.length > 0) {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.classroomsCardHeader}</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Table striped bordered hover responsive="lg" >
                                <thead>
                                    <tr>
                                        <th>{config.tableHeaderID}</th>
                                        <th>{config.tableHeaderName}</th>
                                        <th>{config.tableHeaderDescription}</th>
                                        <th>{config.tableHeaderStudents}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.classroom_array.map(this.classroomRowGenerator)}
                                </tbody>
                            </Table>
                        </Container>
                    </Card.Body>
                </Card>
            );
        }
        else {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.classroomsCardHeader}</Card.Header>
                    <Card.Body>
                        <Card.Title>
                            {config.noClassroomCoach}
                        </Card.Title>
                    </Card.Body>
                </Card>
            );
        }

    }

    classRowGenerator = (class_row: classroom_class) => (
        <tr key={class_row.id} >
            <td><a href={'/class/' + class_row.class_hash}>{class_row.id}</a></td>
            <td>{new Date(class_row.start_time).toLocaleString()}</td>
            <td>{class_row.duration}</td>
            <td>{new Date(class_row.created_at).toLocaleString()}</td>
            <td>
                <Button variant="dark" onClick={() => { this.deleteClass(class_row.id, class_row.classroom_id) }}>
                    Delete
                </Button>
            </td>
        </tr>
    );

    renderClassTable() {
        const collapse_condition = this.state.selected_classroom_id === -1;
        const no_class_condition = (this.state.selected_classroom_class_array && this.state.selected_classroom_class_array.length > 0);
        const table_element = (!no_class_condition) ?
            (
                <Container>
                    No Classes Scheduled
                </Container>
            ) :
            (
                <Container fluid>
                    <Table striped bordered hover responsive="lg" >
                        <thead>
                            <tr>
                                <th>Class ID/Link</th>
                                <th>Start Time</th>
                                <th>Duration</th>
                                <th>Created At</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.selected_classroom_class_array?.map(this.classRowGenerator)}
                        </tbody>
                    </Table>
                </Container>
            );
        console.log("rendering class table");
        return (
            <Card.Body>
                <Collapse in={!collapse_condition} >
                    {table_element}
                </Collapse>
                <Collapse in={collapse_condition}>
                    <Container>
                        Select a classroom
                    </Container>
                </Collapse>
            </Card.Body>
        );
    }

    onStartTimeChange = (ev: any) => {
        const today: Date = new Date();
        const date_obj: Date = new Date(ev.target.value);
        const validity: boolean = !isNaN(date_obj.getDate()) && (date_obj >= today);
        this.setState({
            start_time_input: ev.target.value,
            start_time: date_obj,
            start_time_is_invalid: !validity
        });
    }

    onDurationChange = (ev: any) => {
        this.setState({
            duration: ev.target.value,
            duration_is_invalid: !ev.target.value
        });
    }

    resetFormAndSelectedClassroom = () => {
        this.setState({
            selected_classroom_id: -1,
            selected_classroom_class_array: null,
            start_time_input: '',
            start_time: new Date(),
            start_time_is_invalid: true,
            duration: 0,
            duration_is_invalid: true,
        });
    }

    renderClassForm() {
        return (
            <Collapse in={this.state.selected_classroom_id !== -1}>
                <Card.Body>
                    <Container>
                        <Form>
                            <Form.Row>
                                <Form.Group sm={6} as={Col} >
                                    <Form.Control isInvalid={this.state.start_time_is_invalid} value={this.state.start_time_input} onChange={this.onStartTimeChange} placeholder="Date and Time" />
                                    <Form.Control.Feedback type="invalid" >
                                        Date and Time (MM/DD/YYYY, HH:MM:SS) must be valid
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group sm={6} as={Col} >
                                    <Form.Control readOnly value={this.state.start_time.toLocaleString()} />
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group sm={12} as={Col} >
                                    <Form.Control value={this.state.duration} onChange={this.onDurationChange} isInvalid={this.state.duration_is_invalid} placeholder="Duration" />
                                    <Form.Control.Feedback type="invalid" >
                                        Duration (in minutes) must be valid
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                        </Form>
                        <Button variant="dark" disabled={this.state.duration_is_invalid || this.state.start_time_is_invalid} onClick={() => { this.addClass() }} block>
                            Done
                        </Button>
                        <Button variant="dark" onClick={this.resetFormAndSelectedClassroom} block>
                            Cancel
                        </Button>
                    </Container>
                </Card.Body>
            </Collapse>
        );
    }

    render() {
        return (
            <div>
                {this.renderClassroomTable()}
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Class</Card.Header>
                    {this.renderClassTable()}
                    {this.renderClassForm()}
                </Card>
            </div>
        )
    }
}
