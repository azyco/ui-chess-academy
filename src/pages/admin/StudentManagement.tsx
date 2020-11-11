import React from 'react';

import {
    Container,
    Card,
    Table
} from 'react-bootstrap';

//import config from '../../config';
import Api from '../../api/backend';

type StudentManagementProps = {
    onAlert: Function,
    unauthorizedLogout: Function
}

type StudentManagementState = {
    student_array: user[]
}

type user = {
    id: number,
    email: string,
    user_type: string,
    fullname: string
}

export class StudentManagement extends React.Component<StudentManagementProps, StudentManagementState>{
    constructor(props: StudentManagementProps) {
        super(props);
        this.state = {
            student_array: []
        }
    }

    componentDidMount() {
        this.updateStudentArray();
    }

    updateStudentArray() {
        Api.get('/student').then((response) => {
            console.log("updated student array in student management ", response);
            this.setState({
                student_array: response.data.student_array,
            });
        }).catch((error) => {
            console.log("failed to update student array in student management ", error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
        });
    }

    studentTableGenerator = (student: user) => (
        <tr key={student.id} >
            <td>{student.id}</td>
            <td>{student.fullname}</td>
            <td>{student.email}</td>
        </tr>
    );

    renderStudentTable() {
        if (this.state.student_array && this.state.student_array.length > 0) {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Students</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Table striped bordered hover responsive="lg" >
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>E-Mail</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.student_array.map(this.studentTableGenerator)}
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
                    <Card.Header as='h5'>Students</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            <Card.Title>
                                No Students present
                            </Card.Title>
                        </Container>
                    </Card.Body>
                </Card>
            )
        }

    }

    render() {
        return (
            <div>
                {this.renderStudentTable()}
            </div>
        );
    }
}