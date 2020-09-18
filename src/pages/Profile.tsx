import React from 'react';
import { Container, Alert } from 'react-bootstrap';

import config from '../config';

// import { Dashboard_Student } from './student/Dashboard_Student';
// import { Dashboard_Coach} from './coach/Dashboard_Coach';
// import { Class_Student } from './student/Class_Student';
// import { Class_Coach} from './coach/Class_Coach';

type ProfileProps = {
    
};

type ProfileState = {
    user_is_student:boolean;
};

export class Profile extends React.Component<ProfileProps,ProfileState> {
    constructor(props:ProfileState){
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
