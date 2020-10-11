import React from 'react';

import {
    Container,
    Button,
    Col,
    Card,
    Table,
    Form,
    Collapse
} from 'react-bootstrap';

import config from '../../config';
import Api from '../../api/backend';

type classroom = {
    id: number,
    name: string,
    description: string,
    is_active: boolean,
    created_at: Date,
    student_count: number,
    coaches: string[]
}

type user = {
    id: number,
    email: string,
    user_type: string,
    fullname: string
}

type ClassroomManagementProps = {
    onAlert: Function
}

type ClassroomManagementState = {
    classroom_array: classroom[],
    student_array: user[],
    student_array_available: (user | null)[],
    student_array_selected: (user | null)[],
    coach_array: user[],
    coach_array_available: (user | null)[],
    coach_array_selected: (user | null)[],
    selected_source_student_array_index: number,
    selected_destination_student_array_index: number,
    selected_source_coach_array_index: number,
    selected_destination_coach_array_index: number,
    classroom_name: string,
    classroom_description: string,
    classroom_edit_id: number,
    classroom_details_is_dirty: boolean,
    student_array_selected_is_dirty: boolean,
    coach_array_selected_is_dirty: boolean,
    show_form: boolean,
    classroom_name_is_invalid: boolean
}

export class ClassroomManagement extends React.Component<ClassroomManagementProps, ClassroomManagementState>{
    constructor(props: ClassroomManagementProps) {
        super(props);
        this.state = {
            classroom_array: [],
            student_array: [],
            student_array_available: [],
            student_array_selected: [],
            coach_array: [],
            coach_array_available: [],
            coach_array_selected: [],
            selected_source_student_array_index: -1,
            selected_destination_student_array_index: -1,
            selected_source_coach_array_index: -1,
            selected_destination_coach_array_index: -1,
            classroom_name: '',
            classroom_description: '',
            classroom_edit_id: -1,
            classroom_details_is_dirty: false,
            student_array_selected_is_dirty: false,
            coach_array_selected_is_dirty: false,
            show_form: false,
            classroom_name_is_invalid: true
        };
        this.renderForm = this.renderForm.bind(this);
    }

    componentDidMount() {
        this.updateClassroomArray();
        //this.updateStudentAndCoachArray();
    }

    updateClassroomArray() {
        Api.get('/classroom').then((response) => {
            console.log("classroom array updated ", response);
            this.setState({ classroom_array: Array.from(response.data.classroom_array) }, () => {
                console.log("state after classroom update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update classroom array ", error);
        });
    }

    updateStudentAndCoachArray() {
        Api.get('/user').then((response) => {
            console.log("student and coach arrays updated", response);
            let student_array: user[] = [];
            let coach_array: user[] = [];
            response.data.forEach((user: user) => {
                if (user.user_type === 'student') {
                    student_array.push(user);
                }
                else if (user.user_type === 'coach') {
                    coach_array.push(user);
                }
            });
            this.setState({
                student_array: student_array,
                student_array_available: Array.from(student_array),
                student_array_selected: new Array(student_array.length).fill(null),

                coach_array: coach_array,
                coach_array_available: Array.from(coach_array),
                coach_array_selected: new Array(coach_array.length).fill(null)
            }, () => {
                console.log("state after student and coach array update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update student and coach arrays", error);
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
            <td>{(classrom_row.is_active) ? "Yes" : "No"}</td>
            <td>{classrom_row.created_at}</td>
            <td>{classrom_row.coaches}</td>
            <td>{classrom_row.student_count}</td>
            <td><Button onClick={() => { this.onClassroomEditStart(classrom_row) }} >Edit</Button></td>
        </tr>
    );

    onClassroomNameChange = (ev: any) => {
        this.setState({
            classroom_name: ev.target.value,
            classroom_details_is_dirty: true,
            classroom_name_is_invalid: !ev.target.value
        });
    }

    onClassroomDescriptionChange = (ev: any) => {
        this.setState({
            classroom_description: ev.target.value,
            classroom_details_is_dirty: true
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
            let std_arr_in = this.state.student_array_available;
            let std_arr_out = this.state.student_array_selected;
            // console.log("before");
            // console.log("std_arr_in: ", this.state.student_array_available);
            // console.log("std_arr_out: ", this.state.student_array_selected);
            std_arr_out[this.state.selected_source_student_array_index] = this.state.student_array_available[this.state.selected_source_student_array_index];
            std_arr_in[this.state.selected_source_student_array_index] = null;
            this.setState({
                student_array_available: std_arr_in,
                student_array_selected: std_arr_out,
                selected_source_student_array_index: -1,
                student_array_selected_is_dirty: true
            },
                () => {
                    // console.log("after");
                    // console.log("std_arr_in: ", this.state.student_array_available);
                    // console.log("std_arr_out: ", this.state.student_array_selected);
                });
        }
        else {
            this.props.onAlert({ alert_type: "warning", alert_text: "You need to select something first" });
        }
    }

    removeSelectedStudentID = () => {
        if (this.state.selected_destination_student_array_index !== -1) {
            let std_arr_in = this.state.student_array_available;
            let std_arr_out = this.state.student_array_selected;
            // console.log("before");
            // console.log("std_arr_in: ", this.state.student_array_available);
            // console.log("std_arr_out: ", this.state.student_array_selected);
            std_arr_in[this.state.selected_destination_student_array_index] = this.state.student_array_selected[this.state.selected_destination_student_array_index];
            std_arr_out[this.state.selected_destination_student_array_index] = null;
            this.setState({
                student_array_available: std_arr_in,
                student_array_selected: std_arr_out,
                selected_destination_student_array_index: -1,
                student_array_selected_is_dirty: true
            },
                () => {
                    // console.log("after");
                    // console.log("std_arr_in: ", std_arr_in);
                    // console.log("std_arr_out: ", std_arr_out);
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
        });
    }

    countSelectedUsers(user_array: (user | null)[]) {
        const new_arr = user_array.filter((value, index, array) => { if (value) { return value; } })
        return new_arr.length;
    }

    addSelectedCoachID = () => {
        if (this.state.selected_source_coach_array_index !== -1) {
            if (this.countSelectedUsers(this.state.coach_array_selected) < 1) {
                let std_arr_in = this.state.coach_array_available;
                let std_arr_out = this.state.coach_array_selected;
                std_arr_out[this.state.selected_source_coach_array_index] = this.state.coach_array_available[this.state.selected_source_coach_array_index];
                std_arr_in[this.state.selected_source_coach_array_index] = null;
                this.setState({
                    coach_array_available: std_arr_in,
                    coach_array_selected: std_arr_out,
                    selected_source_coach_array_index: -1,
                    coach_array_selected_is_dirty: true
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
            let std_arr_in = this.state.coach_array_available;
            let std_arr_out = this.state.coach_array_selected;
            std_arr_in[this.state.selected_destination_coach_array_index] = this.state.coach_array_selected[this.state.selected_destination_coach_array_index];
            std_arr_out[this.state.selected_destination_coach_array_index] = null;
            this.setState({
                coach_array_available: std_arr_in,
                coach_array_selected: std_arr_out,
                selected_destination_coach_array_index: -1,
                coach_array_selected_is_dirty: true
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
                            <Form.Label>{config.availableStudentsAdmin}</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedSourceStudentChange}>
                                {this.state.student_array_available.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment key={index} /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.addSelectedStudentID}>
                                {config.addButtonText}
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="student_select_sink">
                            <Form.Label>{config.selectedStudentsAdmin}</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedDestinationStudentChange}>
                                {this.state.student_array_selected.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment key={index} /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.removeSelectedStudentID}>
                                {config.removeButtonText}
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            );
        }
        else {
            return (
                <Container>
                    {config.noStudentsAdmin}
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
                            <Form.Label>{config.availableCoachesAdmin}</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedSourceCoachChange}>
                                {this.state.coach_array_available.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment key={index} /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.addSelectedCoachID}>
                                {config.addButtonText}
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="coach_select_sink">
                            <Form.Label>{config.selectedCoachesAdmin}</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedDestinationCoachChange}>
                                {this.state.coach_array_selected.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment key={index} /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.removeSelectedCoachID}>
                                {config.removeButtonText}
                            </Button>
                        </Form.Group>
                    </Col>
                </Form.Row>
            );
        }
        else {
            return (
                <Container>
                    {config.noCoachesAdmin}
                </Container>
            );
        }
    }

    onClassroomCreateEnd = () => {
        console.log("classroom created with state: ", this.state);
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
            console.log("classroom created: ", response);
            this.updateClassroomArray();
            this.resetState();
            this.props.onAlert({ alert_type: "success", alert_text: "Class added Successfully" });
        }).catch((error) => {
            console.log("error while creating class", error);
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

    renderClassroomTable() {
        console.log("rendering classroom table");
        if (this.state.classroom_array && this.state.classroom_array.length > 0) {
            return (
                <Table striped bordered hover responsive="lg" >
                    <thead>
                        <tr>
                            <th>{config.tableHeaderID}</th>
                            <th>{config.tableHeaderName}</th>
                            <th>{config.tableHeaderDescription}</th>
                            <th>{config.tableHeaderActive}</th>
                            <th>{config.tableHeaderCreationDate}</th>
                            <th>{config.tableHeaderCoaches}</th>
                            <th>{config.tableHeaderStudents}</th>
                            <th></th>
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
                    {config.noClassroomsAdmin}
                </div>
            )
        }

    }

    onClassroomEditStart(classrom_row: classroom) {
        this.updateStudentAndCoachArray();
        this.setState({ classroom_edit_id: classrom_row.id }, () => {
            Api.get('/classroom_mappings?classroom_id=' + classrom_row.id).then((response) => {
                console.log("got classroom mappings: ", response);
                const student_id_arr_selected = response.data.students.split(',').map(Number);
                const coach_id_arr_selected = response.data.coaches.split(',').map(Number);
                const classroom_description = classrom_row.description;
                const classroom_name = classrom_row.name;
                let student_array_available: (user | null)[] = this.state.student_array_available;
                let student_array_selected: (user | null)[] = [];
                let coach_array_available: (user | null)[] = this.state.coach_array_available;
                let coach_array_selected: (user | null)[] = [];

                student_id_arr_selected.forEach((student_id_arr_row: number) => {
                    this.state.student_array_available.forEach((student, student_swap_index) => {
                        console.log(student, student_id_arr_row)
                        if (student_id_arr_row === student?.id) {
                            console.log("match!");
                            student_array_selected[student_swap_index] = this.state.student_array_available[student_swap_index];
                            student_array_available[student_swap_index] = null;
                        }
                    });
                });

                coach_id_arr_selected.forEach((coach_id_arr_row: number) => {
                    this.state.coach_array_available.forEach((coach, coach_swap_index) => {
                        if (coach_id_arr_row === coach?.id) {
                            coach_array_selected[coach_swap_index] = this.state.coach_array_available[coach_swap_index];
                            coach_array_available[coach_swap_index] = null;
                        }
                    });
                });

                this.setState({
                    classroom_description,
                    classroom_name,
                    student_array_available,
                    student_array_selected,
                    coach_array_available,
                    coach_array_selected,
                    show_form: true,
                    classroom_name_is_invalid: false
                });
            }).catch((error) => {
                console.log("failed to update mappings, reverting to add mode ", error);
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            });
        });
    }

    onClassroomEditEnd = () => {
        console.log("data before classroom edit submission ", this.state);
        const coach_array_selected_filtered = this.state.coach_array_selected.filter((value, index, array) => { if (value) { return value; } });
        const student_array_selected_filtered = this.state.student_array_selected.filter((value, index, array) => { if (value) { return value; } });
        Api.put('/classroom', {
            classroom_data: {
                classroom_id: this.state.classroom_edit_id,
                classroom_name: this.state.classroom_name,
                classroom_description: this.state.classroom_description,
                student_array_selected: student_array_selected_filtered,
                coach_array_selected: coach_array_selected_filtered,
                classroom_details_is_dirty: this.state.classroom_details_is_dirty,
                coach_array_selected_is_dirty: this.state.coach_array_selected_is_dirty,
                student_array_selected_is_dirty: this.state.student_array_selected_is_dirty
            }
        }).then((response) => {
            console.log("classroom edited succesfully ", response);
            this.props.onAlert({ alert_type: "success", alert_text: "Classroom edited Successfully" });
            this.updateClassroomArray();
            this.resetState();
        }).catch((error) => {
            console.log("error while editing classroom ", error);
            if (error.response) {
                if (error.response.data.error_code === 'ER_DUP_ENTRY') {
                    this.props.onAlert({ alert_type: "warning", alert_text: "Classroom name already exists" });
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

    resetState = () => {
        console.log("before state reset ", this.state);
        this.setState({
            student_array_available: Array.from(this.state.student_array),
            student_array_selected: [],
            coach_array_available: Array.from(this.state.coach_array),
            coach_array_selected: [],
            selected_source_student_array_index: -1,
            selected_destination_student_array_index: -1,
            selected_source_coach_array_index: -1,
            selected_destination_coach_array_index: -1,
            classroom_name: '',
            classroom_description: '',
            classroom_edit_id: -1,
            classroom_details_is_dirty: false,
            student_array_selected_is_dirty: false,
            coach_array_selected_is_dirty: false,
            show_form: false
        }, () => {
            console.log("after state reset ", this.state);
        });
    }

    onClassroomCreateStart = () => {
        this.updateStudentAndCoachArray();
        this.setState({ show_form: true });
    }

    submitClassroomButton() {
        if (this.state.classroom_edit_id > -1) {
            return (
                <div>
                    <Button variant="dark" block onClick={this.onClassroomEditEnd} disabled={this.state.classroom_name_is_invalid}>
                        {config.doneButtonText}
                    </Button>
                    <Button variant="dark" block onClick={this.resetState}>
                        {config.cancelButtonText}
                    </Button>
                </div>
            );
        }
        else {
            return (
                <div>
                    <Button variant="dark" block onClick={this.onClassroomCreateEnd} disabled={this.state.classroom_name_is_invalid}>
                        {config.doneButtonText}
                    </Button>
                    <Button variant="dark" block onClick={this.resetState}>
                        {config.cancelButtonText}
                    </Button>
                </div>
            );
        }
    }

    renderForm() {
        return (
            <Container>
                <Form>
                    <Form.Row>
                        <Form.Group md={6} as={Col}>
                            <Form.Label>{config.classroomNameLabel}</Form.Label>
                            <Form.Control placeholder="Classroom Name" value={this.state.classroom_name} onChange={this.onClassroomNameChange} isInvalid={this.state.classroom_name_is_invalid} />
                            <Form.Control.Feedback type="invalid">
                                {config.classroomNameInvalidFeedback}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group md={6} as={Col}>
                            <Form.Label>{config.classroomDescriptionLabel}</Form.Label>
                            <Form.Control type="textarea" placeholder="Classroom Description" value={this.state.classroom_description} onChange={this.onClassroomDescriptionChange} />
                        </Form.Group>
                    </Form.Row>
                    {this.renderStudentSelect()}
                    {this.renderCoachSelect()}
                    {this.submitClassroomButton()}
                </Form>
            </Container>
        );
    }

    render() {
        return (
            <div>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.classroomsCardHeader}</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            {this.renderClassroomTable()}
                        </Container>
                    </Card.Body>
                </Card>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as="h5" >
                        {(this.state.classroom_edit_id === -1) ? "Add Classroom" : "Edit Classroom"}
                    </Card.Header>
                    <Card.Body>
                        <Collapse in={!this.state.show_form}>
                            <Button variant='dark' onClick={this.onClassroomCreateStart} block>
                                {config.addButtonText}
                            </Button>
                        </Collapse>
                        <Collapse in={this.state.show_form}>
                            {this.renderForm()}
                        </Collapse>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}