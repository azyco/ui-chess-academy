import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';

type userDetailsType = {
    id: number,
    user_type: string,
    email: string,
    created_at: string
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
}

type DashboardCoachProps = {
    onAlert: Function,
    onLogout: any,
    user_details: userDetailsType |null
}

type DashboardCoachState = {

}

export class DashboardCoach extends React.Component<DashboardCoachProps, DashboardCoachState >{
    constructor(props:DashboardCoachProps){
        super(props);
        
    }

    render (){
        return(
            <div>
                <ProSidebar>
                <Menu iconShape="square">
                    <MenuItem  >Dashboard</MenuItem>
                    <SubMenu title="Components" >
                        <MenuItem>Component 1</MenuItem>
                        <MenuItem>Component 2</MenuItem>
                    </SubMenu>
                    <MenuItem  >
                        <Button variant="dark" onClick={this.props.onLogout} >
                            Logout
                        </Button>
                    </MenuItem>
                </Menu>
                </ProSidebar>
                <Container>
                    Coach-Dashboard
                </Container>
            </div>
        );
    }
}
