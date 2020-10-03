import React from 'react';

import {
    Container,
    Button,
    Col,
    Card,
    Table,
    Form
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

type ClassroomManagementProps ={
    onAlert: Function
}

type classroom_state_before_edit_type = {
    classroom_name: string,
    classroom_description: string,
    student_array_selected: (user | null)[],
    coach_array_selected: (user | null)[]
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
    student_id_arr_selected:any, // array of objects, each with 1 id (number)
    coach_id_arr_selected: any,
    classroom_details_is_dirty: boolean,
    student_array_selected_is_dirty: boolean,
    coach_array_selected_is_dirty: boolean,
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
            student_id_arr_selected: [],
            coach_id_arr_selected: [],
            classroom_details_is_dirty: false,
            student_array_selected_is_dirty: false,
            coach_array_selected_is_dirty: false
        };
        this.updateClassroomArray();
        this.updateStudentArray();
        this.updateCoachArray();
    }

    updateClassroomArray() {
        Api.get('/classroom').then((response) => {
            console.log("classroom array updated ", response);
            this.setState({ classroom_array: Array.from(response.data.classroom_array) },()=>{
                console.log("state after classroom update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update classroom array ",error);
        });
    }

    updateStudentArray() {
        Api.get('/student').then((response) => {
            console.log("student array updated",response);
            this.setState({
                student_array: Array.from(response.data.student_array),
                student_array_available: Array.from(response.data.student_array),
                student_array_selected: new Array(response.data.student_array.length).fill(null)
            },()=>{
                console.log("state after student array update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update student array",error);
        });
    }

    updateCoachArray() {
        Api.get('/coach').then((response) => {
            console.log("coach array updated ",response);
            this.setState({
                coach_array: Array.from(response.data.coach_array),
                coach_array_available: Array.from(response.data.coach_array),
                coach_array_selected: new Array(response.data.coach_array.length).fill(null)
            },()=>{
                console.log("state after coach array update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update coach array ",error);
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
            <td>{classrom_row.coaches}</td>
            <td>{classrom_row.student_count}</td>
            <td><Button onClick={()=>{this.onClassroomEditStart(classrom_row)}} >Edit</Button></td>
        </tr>
    );

    onClassroomNameChange = (ev: any) => {
        this.setState({
            classroom_name: ev.target.value,
            classroom_details_is_dirty: true
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
                            <Form.Label>Available Students</Form.Label>
                            <Form.Control as="select" htmlSize={5} onChange={this.onSelectedSourceStudentChange}>
                                {this.state.student_array_available.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.addSelectedStudentID}>
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
                            <Button variant="outline-dark" block onClick={this.removeSelectedStudentID}>
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
                                {this.state.coach_array_available.map((user_option, index) => { if (user_option) { return this.userOptionGenerator(user_option, index) } else { return <React.Fragment /> } })}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Button variant="outline-dark" block onClick={this.addSelectedCoachID}>
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
                            <Button variant="outline-dark" block onClick={this.removeSelectedCoachID}>
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

    onClassroomCreate = () => {
        console.log("classroom created with state: ",this.state);
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
            this.onClassroomEditCancel();
            this.props.onAlert({ alert_type: "success", alert_text: "Class added Successfully" });
        }).catch((error) => {
            console.log("error while creating class",error);
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
        if (this.state.classroom_array) {
            return (
                <Table striped bordered hover responsive="lg" >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Active</th>
                            <th>Creation Date</th>
                            <th>Coaches</th>
                            <th>Students</th>
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
                    No Classrooms present
                </div>
            )
        }

    }

    onClassroomEditStart(classrom_row: classroom){
        this.setState({classroom_edit_id: classrom_row.id});
        Api.get('/classroom_mappings?classroom_id='+classrom_row.id).then((response)=>{
            console.log("got classroom mappings: ",response);
            this.setState({
                student_id_arr_selected: response.data.student_id_arr_selected,
                coach_id_arr_selected: response.data.coach_id_arr_selected,
                classroom_description: classrom_row.description,
                classroom_name: classrom_row.name
            },()=>{
                this.state.student_id_arr_selected.forEach((student_id_arr_row:any)=>{
                    this.state.student_array_available.forEach((student,student_swap_index)=>{
                        if(student_id_arr_row.student_id === student?.id){
                            let std_arr_in = this.state.student_array_available;
                            let std_arr_out = this.state.student_array_selected;
                            std_arr_out[student_swap_index] = this.state.student_array_available[student_swap_index];
                            std_arr_in[student_swap_index] = null;
                            this.setState({
                                student_array_available: std_arr_in,
                                student_array_selected: std_arr_out
                            });
                        }
                    });
                });

                this.state.coach_id_arr_selected.forEach((coach_id_arr_row:any)=>{
                    this.state.coach_array_available.forEach((coach,coach_swap_index)=>{
                        if(coach_id_arr_row.coach_id === coach?.id){
                            let std_arr_in = this.state.coach_array_available;
                            let std_arr_out = this.state.coach_array_selected;
                            std_arr_out[coach_swap_index] = this.state.coach_array_available[coach_swap_index];
                            std_arr_in[coach_swap_index] = null;
                            this.setState({
                                coach_array_available: std_arr_in,
                                coach_array_selected: std_arr_out,
                            });
                        }
                    });
                });

            });
        }).catch((error)=>{
            console.log("failed to update mappings, reverting to add mode ",error);
            this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
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
            console.log("classroom edited succesfully ",response);
            this.props.onAlert({ alert_type: "success", alert_text: "Classroom edited Successfully" });
            this.updateClassroomArray();
            this.onClassroomEditCancel();
        }).catch((error) => {
            console.log("error while editing classroom ",error);
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

    onClassroomEditCancel = () => {
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
            student_id_arr_selected: [],
            coach_id_arr_selected: [],
            classroom_details_is_dirty: false,
            student_array_selected_is_dirty: false,
            coach_array_selected_is_dirty: false
        },()=>{
            console.log("after state reset ", this.state);
        });
    }

    submitClassroomButton(){
        if(this.state.classroom_edit_id > -1){
            return(
                <div>
                    <Button variant="dark" block onClick={this.onClassroomEditEnd}>
                        Done
                    </Button>
                    <Button variant="dark" block onClick={this.onClassroomEditCancel}>
                        Cancel
                    </Button>
                </div>
            );
        }
        else{
            return(
                <Button variant="dark" block onClick={this.onClassroomCreate}>
                    Done
                </Button>
            );
        }
    }

    render() {
        return (
            <div>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Classrooms</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            {this.renderClassroomTable()}
                        </Container>
                    </Card.Body>
                </Card>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{(this.state.classroom_edit_id === -1)?"Add Classroom":"Edit Classroom"}</Card.Header>
                    <Card.Body>
                        <Container>
                            <Form>
                                <Form.Row>
                                    <Form.Group md={6} as={Col}>
                                        <Form.Label>Classroom Name</Form.Label>
                                        <Form.Control placeholder="Classroom Name" value={this.state.classroom_name} onChange={this.onClassroomNameChange} />
                                    </Form.Group>
                                    <Form.Group md={6} as={Col}>
                                        <Form.Label>Classroom Description</Form.Label>
                                        <Form.Control type="textarea" placeholder="Classroom Description" value={this.state.classroom_description} onChange={this.onClassroomDescriptionChange} />
                                    </Form.Group>
                                </Form.Row>
                                {this.renderStudentSelect()}
                                {this.renderCoachSelect()}
                            </Form>
                        </Container>
                        {this.submitClassroomButton()}
                    </Card.Body>
                </Card>
            </div>
        );
    }
}