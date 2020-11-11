import React from 'react';

import {
    Container,
    Card
} from 'react-bootstrap';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

type PuzzlesStudentProps = {
    user_authentication: userAuthenticationType,
    onAlert: Function,
    unauthorizedLogout: Function
}

type PuzzlesStudentState = {
    
}

export class PuzzlesStudent extends React.Component<PuzzlesStudentProps, PuzzlesStudentState>{
    // constructor(props: DashboardStudentProps) {
    //     super(props);
    // }
    render() {
        return (
            <Container>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>Puzzles</Card.Header>
                    <Card.Body>
                        Create puzzles
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}
