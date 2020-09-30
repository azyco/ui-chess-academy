import React from 'react';
import { Redirect } from 'react-router-dom'

import { DashboardStudent } from './student/DashboardStudent';
import { DashboardCoach } from './coach/DashboardCoach';
import { Admin } from './Admin';

//import config from '../config';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
};

type userProfileType = {
    fullname: string,
    country: string,
    state: string,
    description: string,
    user_image: Blob,
    fide_id: string,
    lichess_id: string,
    contact: number,
    contact_code: number,
    alt_contact: number,
    alt_contact_code: number,
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
    updateState: Function
};

type ProfileState = {
    signed_in: boolean
};

export class Profile extends React.Component<ProfileProps, ProfileState> {
    constructor(props: ProfileProps) {
        super(props);
        this.state = {
            signed_in: (!!this.props.user_authentication)
        };
    }

    componentWillReceiveProps(nextProps: ProfileProps) {
        if (nextProps.user_authentication !== this.props.user_authentication) {
            this.setState({
                signed_in: (!!nextProps.user_authentication),
            });
        }
    }

    render() {
        if (this.state.signed_in &&
            this.props.user_authentication &&
            this.props.user_profile) {
            if (this.props.user_authentication?.user_type === 'student') {
                return (<DashboardStudent updateState={this.props.updateState} user_profile={this.props.user_profile} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
            }
            else if (this.props.user_authentication?.user_type === 'coach') {
                return (<DashboardCoach updateState={this.props.updateState} user_profile={this.props.user_profile} user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
            }
            else if (this.props.user_authentication?.user_type === 'admin ') {
                return (<Admin user_authentication={this.props.user_authentication} onAlert={this.props.onAlert} onLogout={this.props.onLogout} />);
            }
            else {
                return (<Redirect to='/' />);
            }
        }
        else {
            return (<Redirect to='/' />);
        }
    }

}
