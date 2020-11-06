import React from 'react';
import { Redirect } from 'react-router-dom'

import { DashboardStudent } from './student/DashboardStudent';
import { DashboardCoach } from './coach/DashboardCoach';
import { Admin } from './admin/Admin';
import { Container, Card } from 'react-bootstrap';

//import config from '../config';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
};

type userProfileType = {
    fullname: string,
    country: string,
    state: string,
    description: string,
    user_image: Blob,
    fide_id: string,
    lichess_id: string,
    contact: string,
    contact_code: string,
    alt_contact: string,
    alt_contact_code: string,
    dob: Date,
    parent: string,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean,
    is_private_parent: boolean
};

type ProfileProps = {
    user_authentication: userAuthenticationType | null,
    user_profile: userProfileType | null,
    onLogout: Function,
    onAlert: Function,
    updateState: Function,
    user_authorization_check_complete: boolean
};

type ProfileState = {
};

export class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
        };
    }

    // componentWillReceiveProps(nextProps: ProfileProps) {
    //     if (nextProps.user_authentication !== this.props.user_authentication) {
    //         this.setState({
    //             signed_in: (!!nextProps.user_authentication),
    //         });
    //     }
    // }

    render() {
        if (this.props.user_authorization_check_complete) {
            if (this.props.user_authentication) {
                if (this.props.user_authentication.user_type === 'student' && !!this.props.user_profile) {
                    return (<DashboardStudent updateState={this.props.updateState} user_profile={this.props.user_profile} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
                }
                else if (this.props.user_authentication.user_type === 'coach' && !!this.props.user_profile) {
                    return (<DashboardCoach updateState={this.props.updateState} user_profile={this.props.user_profile} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
                }
                else if (this.props.user_authentication.user_type === 'admin') {
                    return (<Admin user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
                }
                else {
                    console.log("Bad user type", this.props.user_authentication, this.props.user_profile);
                    return (<Redirect to='/' />);
                }
            }
            else {
                console.log("User not logged in");
                return (<Redirect to='/' />);
            }
        }
        else {
            return (
                <Container>
                    <Card bg="light" style={{ marginTop: '1em' }}>
                        <Card.Header as="h5" >Loading</Card.Header>
                        <Card.Body>
                            Please Wait
                        </Card.Body>
                    </Card>
                </Container>
            )
        }
    }
}
