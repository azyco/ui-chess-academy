import React from 'react';

import {
    Container,
    Card,
    Table
} from 'react-bootstrap';

import { RegisterCoach } from './RegisterCoach';

//import config from '../../config';
import Api from '../../api/backend';

type CoachManagementProps = {
    onAlert: Function
}

type CoachManagementState = {
    coach_array: user[]
}

type user = {
    id: number,
    email: string,
    user_type: string,
    fullname: string
}

export class CoachManagement extends React.Component<CoachManagementProps, CoachManagementState>{
    constructor(props: CoachManagementProps) {
        super(props);
        this.state = {
            coach_array: []
        }
    }

    updateCoachArrayCallback = () => {
        this.updateCoachArray();
    }

    componentDidMount() {
        this.updateCoachArray();
    }

    updateCoachArray() {
        Api.get('/coach').then((response) => {
            console.log("updated coach array in coach management ", response);
            this.setState({
                coach_array: response.data.coach_array,
            });
        }).catch((error) => {
            console.log("failed to update coach array in coach management");
        });
    }

    coachTableGenerator = (coach: user) => (
        <tr key={coach.id} >
            <td>{coach.id}</td>
            <td>{coach.fullname}</td>
            <td>{coach.email}</td>
        </tr>
    );

    renderCoachTable() {
        if (this.state.coach_array) {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Coaches</Card.Header>
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
                                    {this.state.coach_array.map(this.coachTableGenerator)}
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
                    <Card.Header as='h5'>Coaches</Card.Header>
                    <Card.Body>
                        No Coaches present
                    </Card.Body>
                </Card>
            )
        }

    }

    render() {
        return (
            <div>
                {this.renderCoachTable()}
                <RegisterCoach updateCoachArray={this.updateCoachArrayCallback} onAlert={this.props.onAlert} />
            </div>
        );
    }
}