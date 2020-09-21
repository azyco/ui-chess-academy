import React from 'react';
import { Container, Button } from 'react-bootstrap';

import config from '../config';

// import { Dashboard_Student } from './student/Dashboard_Student';
// import { Dashboard_Coach} from './coach/Dashboard_Coach';
// import { Class_Student } from './student/Class_Student';
// import { Class_Coach} from './coach/Class_Coach';

type ProfileProps = {
    profile: any,
    onLogout: any,
    onAlert: Function
};

type ProfileState = {
    signed_in: boolean;
    username: string;
    user_is_student:boolean;
};

export class Profile extends React.Component<ProfileProps,ProfileState> {
    constructor(props:ProfileProps){
        super(props);
        this.state= {
            signed_in: this.props.profile.signed_in,
            username: this.props.profile.username,
            user_is_student:false
        };
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.profile && nextProps.profile.signed_in !== this.state.signed_in) {
            this.setState({
                signed_in: nextProps.profile.signed_in,
                username: nextProps.profile.username
            });
        }
    }

    renderWhenLoggedIn = () => {
        if(this.state.signed_in) {
            return (
                <div>
                    <Button onClick={this.props.onLogout}>
                        Logout
                    </Button>
                </div>
            );
        }
    }

    render() {
        return(
        <Container>
            {this.renderWhenLoggedIn()}
        </Container>
        );
    }
}
