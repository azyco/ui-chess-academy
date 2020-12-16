import React from 'react';

import {
    Container,
    Card,
    Table
} from 'react-bootstrap';

import { RegisterCoach } from './RegisterCoach';

import config from '../../config';
import Api from '../../api/backend';

type CoachManagementProps = {
    onAlert: Function,
    unauthorizedLogout: Function
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
            console.log("failed to update coach array in coach management ", error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
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
        if (this.state.coach_array && this.state.coach_array.length > 0) {
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
                        <Container >
                            No Coaches present
                        </Container>
                    </Card.Body>
                </Card>
            )
        }

    }

    render() {
        return (
            <div>
                {this.renderCoachTable()}
                <RegisterCoach unauthorizedLogout={this.props.unauthorizedLogout} updateCoachArray={() => { this.updateCoachArray() }} onAlert={this.props.onAlert} />
            </div>
        );
    }
}