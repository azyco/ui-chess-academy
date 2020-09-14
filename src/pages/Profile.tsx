import React from 'react';
import { Container, Alert } from 'react-bootstrap';

// import { Dashboard_Student } from './student/Dashboard_Student';
// import { Dashboard_Coach} from './coach/Dashboard_Coach';
// import { Class_Student } from './student/Class_Student';
// import { Class_Coach} from './coach/Class_Coach';

type profile_prop_type = {
};

type profile_state_type = {
    user_is_student:boolean;
};

export class Profile extends React.Component<profile_prop_type,profile_state_type> {
    constructor(props:profile_prop_type){
        super(props);
        this.state= {user_is_student:false};
    }
    
    render() {
        return(
        <Container>
            <Alert  variant="success">
                You have logged in succesfully.
            </Alert>
        </Container>
        );
        }
}
