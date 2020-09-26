import React from 'react';
import { Button } from 'react-bootstrap';
import { ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

// import config from '../config';

// import { Dashboard_Student } from './student/Dashboard_Student';
// import { Dashboard_Coach} from './coach/Dashboard_Coach';
// import { Class_Student } from './student/Class_Student';
// import { Class_Coach} from './coach/Class_Coach';

type userProfileType = {
    user_type: string,
    user_email: string,
    signed_in: boolean
}

type ProfileProps = {
    user_profile: userProfileType,
    onLogout: any,
    onAlert: Function
};

type ProfileState = {
    signed_in: boolean,
    user_email: string,
    user_type: string
};

export class Profile extends React.Component<ProfileProps,ProfileState> {
    constructor(props:ProfileProps){
        super(props);
        this.state= {
            signed_in: this.props.user_profile.signed_in,
            user_email: this.props.user_profile.user_email,
            user_type: this.props.user_profile.user_type
        };
    }

    componentWillReceiveProps(nextProps: any) {
        if (nextProps.profile && nextProps.profile.signed_in !== this.state.signed_in) {
            this.setState({
                signed_in: nextProps.user_profile.signed_in,
                user_email: nextProps.user_profile.user_email,
                user_type: nextProps.user_profile.user_type
            });
        }
    }

    renderWhenLoggedIn = () => {
        if(this.state.signed_in) {
            return (
                    <ProSidebar>
                        <Menu iconShape="square">
                            <MenuItem>
                                Dashboard
                            </MenuItem>
                            <MenuItem>
                                Class
                            </MenuItem>
                            <MenuItem>
                                Edit Profile
                            </MenuItem>
                            <MenuItem >
                                <Button variant="dark" onClick={this.props.onLogout}>
                                    Logout
                                </Button>
                            </MenuItem>
                        </Menu>
                    </ProSidebar>
            );
        }
    }

    render() {
        return(
        <div>
            {this.renderWhenLoggedIn()}
        </div>
        );
    }
}
