import React from 'react';

import {
    Container,
    Card,
    Table,
    Button, Collapse
} from 'react-bootstrap';

import config from '../../config';
import Api from '../../api/backend';

type classroom = {
    id: number,
    name: string,
    description: string,
    coaches: string
}

type classroom_class = {
    id: number,
    classroom_id: number,
    start_time: Date,
    duration: number,
    created_at: string,
    class_hash: string
}

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
}

type ClassStudentProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function
}

type ClassStudentState = {
    classroom_array: classroom[],
    selected_classroom_id: number,
    selected_classroom_class_array: classroom_class[] | null
}

export class ClassStudent extends React.Component<ClassStudentProps, ClassStudentState> {
    constructor(props: ClassStudentProps) {
        super(props);
        this.state = {
            classroom_array: [],
            selected_classroom_id: -1,
            selected_classroom_class_array: null
        };
    }

    componentDidMount() {
        this.updateClassroomArray();
    }

    updateClassroomArray() {
        Api.get('/classroom?student_id=' + this.props.user_authentication.id).then((response) => {
            console.log("classroom array updated ", response);
            this.setState({ classroom_array: Array.from(response.data.classroom_array) }, () => {
                console.log("state after classroom update ", this.state);
            });
        }).catch((error) => {
            console.log("failed to update classroom array ", error);
        });
    }

    getClassArray(classroom_id: number = this.state.selected_classroom_id) {
        Api.get('/class?classroom_id=' + classroom_id).then((response) => {
            console.log("got class array ", response);
            this.setState({
                selected_classroom_class_array: response.data,
                selected_classroom_id: classroom_id
            });
        }).catch((error) => {
            console.log(error);
            this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
        });
    }

    classroomRowGenerator = (classrom_row: classroom) => (
        <tr key={classrom_row.id} >
            <td>{classrom_row.id}</td>
            <td>{classrom_row.name}</td>
            <td>{classrom_row.description}</td>
            <td>{classrom_row.coaches}</td>
            <td>
                <Button variant="dark" onClick={() => { this.getClassArray(classrom_row.id) }} disabled={this.state.selected_classroom_id === classrom_row.id}>
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
                                        <th>{config.tableHeadercoaches}</th>
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
                    <Card.Header as='h5'>{config.noClassroomStudent}</Card.Header>
                </Card>
            )
        }

    }

    classRowGenerator = (class_row: classroom_class) => (
        <tr key={class_row.id} >
            <td><a href={'/class/' + class_row.class_hash}>{class_row.id}</a></td>        
            <td>{class_row.classroom_id}</td>
            <td>{class_row.start_time}</td>
            <td>{class_row.duration}</td>
            <td>{class_row.created_at}</td>
        </tr>
    );

    renderClassTable() {
        const collapse_condition = this.state.selected_classroom_id === -1;
        const no_class_condition = (this.state.selected_classroom_class_array && this.state.selected_classroom_class_array.length > 0);
        const table_element = (!no_class_condition) ?
            (
                <Container>
                    <Card.Title>
                        No Classes Scheduled
                    </Card.Title>
                </Container>
            ) :
            (
                <Container fluid>
                    <Table striped bordered hover responsive="lg" >
                        <thead>
                            <tr>
                                <th>Class ID/Link</th>
                                <th>Classroom ID</th>
                                <th>Start Time</th>
                                <th>Duration</th>
                                <th>Created At</th>
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
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as='h5'>Classes</Card.Header>
                <Card.Body>
                    <Collapse in={!collapse_condition} >
                        {table_element}
                    </Collapse>
                    <Collapse in={collapse_condition}>
                        <Container>
                            <Card.Title>
                                Select a classroom
                            </Card.Title>
                        </Container>
                    </Collapse>
                </Card.Body>
            </Card>
        );
    }

    render() {
        return (
            <div>
                {this.renderClassroomTable()}
                {this.renderClassTable()}
            </div>
        )
    }
}
