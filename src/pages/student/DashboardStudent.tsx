import React from 'react';
import { Container, Button, Row, Col, Card } from 'react-bootstrap';
import { ProSidebar, Menu, SidebarContent, MenuItem } from 'react-pro-sidebar';
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

type DashboardStudentProps = {
    onAlert: Function,
    onLogout: any,
    user_details: userDetailsType |null
}

type DashboardStudentState = {
    is_sidebar_collapsed: boolean
}

export class DashboardStudent extends React.Component<DashboardStudentProps, DashboardStudentState >{
    constructor(props:DashboardStudentProps){
        super(props);
        this.state = {
            is_sidebar_collapsed: true,
        };
    }

    render (){
        return(
            <div>
                <Row>
                    <ProSidebar collapsed={this.state.is_sidebar_collapsed} >
                        <SidebarContent>
                            <Menu >
                                <MenuItem  >Dashboard</MenuItem>
                                <MenuItem icon={(<Button variant="dark" onClick={this.props.onLogout}>Logout</Button>)}/>                                    
                            </Menu>
                        </SidebarContent>
                    </ProSidebar>
                    <Col>
                        <Container>
                            <Card className="text-center">
                                <Card.Header>Dashboard Header</Card.Header>
                                <Card.Body>
                                    <Card.Title>Dashboard</Card.Title>
                                    <Card.Text>
                                        Dashboard contents are displayed here.
                                    </Card.Text>
                                    <Button onClick={()=>{this.setState({is_sidebar_collapsed:!this.state.is_sidebar_collapsed})}} variant="dark">Collapse Sidebar</Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">Extra info to be added here</Card.Footer>
                            </Card>
                        </Container>
                    </Col>                    
                </Row>
            </div>
        );
    }
}
