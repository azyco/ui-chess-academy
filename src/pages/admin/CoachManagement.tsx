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

    componentDidMount(){
        this.updateCoachArray();
    }

    updateCoachArray() {
        Api.get('/coach').then((response) => {
            console.log("updated coach array in coach management ",response);
            this.setState({
                coach_array: response.data.coach_array,
            });
        }).catch((error) => {
            console.log("failed to update coach array in coach management");
        });
    }

    coachTableGenerator = (coach: user) => (
        <tr key={coach.fullname} >
            <td>{coach.id}</td>
            <td>{coach.fullname}</td>
            <td>{coach.email}</td>
        </tr>
    );

    renderCoachTable() {
        if (this.state.coach_array) {
            return (
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
            );
        }
        else {
            return (
                <div>
                    No Coaches present
                </div>
            )
        }

    }

    render(){
        return(
        <div>
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as='h5'>Coaches</Card.Header>
                <Card.Body>
                    <Container fluid>
                        {this.renderCoachTable()}
                    </Container>
                </Card.Body>
            </Card>
            <RegisterCoach onAlert={this.props.onAlert}/>
        </div>
        );
    }
}