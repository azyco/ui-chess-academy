import React from 'react';

import {
    Container,
    Card,
    Table,
} from 'react-bootstrap';

import config from '../../config';
import Api from '../../api/backend';

type classroom = {
    id: number,
    name: string,
    description: string,
    coaches: string
}

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
}

type ClassStudentProps = {
    user_authentication: userAuthenticationType
}

type ClassStudentState = {
    classroom_array: classroom[]
}

export class ClassStudent extends React.Component<ClassStudentProps, ClassStudentState> {
    constructor(props: ClassStudentProps) {
        super(props);
        this.state = {
            classroom_array: []
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

    classroomRowGenerator = (classrom_row: classroom) => (
        <tr key={classrom_row.id} >
            <td>{classrom_row.id}</td>
            <td>{classrom_row.name}</td>
            <td>{classrom_row.description}</td>
            <td>{classrom_row.coaches}</td>
        </tr>
    );

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
                            <th>{config.tableHeadercoaches}</th>
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
                    {config.noClassroomStudent}
                </div>
            )
        }

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
            </div>
        )
    }
}
