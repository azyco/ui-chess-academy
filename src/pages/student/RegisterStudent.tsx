import React from 'react';
import Api from '../../api/backend';
import config from '../../config';

import { Container, Form, Button, Card, Col} from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterStudentProps = {
    onAlert: Function
}

type RegisterStudentState = {
    fullname: string,
    fullname_is_invalid: boolean,
    country: string,
    country_is_invalid: boolean,
    state: string,
    state_is_invalid: boolean,
    description: string,
    fide_id: string,
    lichess_id: string,
    contact: string,
    contact_is_invalid: boolean,
    contact_code: string,
    contact_code_is_invalid: boolean,
    alt_contact: string,
    alt_contact_code: string,
    email: string,
    email_is_invalid:boolean,
    password: string,
    password_is_invalid:boolean,
    dob: Date,
    dob_is_invalid: boolean,
    parent: string,
    parent_is_invalid: boolean,
    parent_is_disabled:boolean,
    registerButtonClicked: boolean,
    photo_blob: Blob
}

export class RegisterStudent extends React.Component<RegisterStudentProps, RegisterStudentState> {
    constructor(props: RegisterStudentProps) {
        super(props);
        this.state = {
            fullname: "",
            fullname_is_invalid: true,
            country: "",
            country_is_invalid: true,
            state: "",
            state_is_invalid: true,
            description: "",
            fide_id: "",
            lichess_id: "",
            contact: "",
            contact_is_invalid: true,
            contact_code: "",
            contact_code_is_invalid: true,
            alt_contact: "",
            alt_contact_code: "",
            email: "",
            email_is_invalid:true,
            password: "",
            password_is_invalid:true,
            dob: new Date(),
            dob_is_invalid: true,
            parent: "",
            parent_is_invalid: true,
            parent_is_disabled:true,
            registerButtonClicked: false,
            photo_blob: new Blob()
        };
    }
    /*
    need something to handle bad registration details, like conflicting emails, short/insecure passwords, or incorrect filling of user details.
    registration button is not to be disabled on such cases
    use onAlert to notify edits to be made
    */
    handleRegister = () => {
        // const encryptedPassword = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex)
        // Api.post('/student', {
        //     email: this.state.email,
        //     password: encryptedPassword,
        //     fullname:this.state.fullname,
        //     country:this.state.country,
        //     state:this.state.state,
        //     contact:this.state.contact,
        //     contact_code:this.state.contact_code,
        //     description:this.state.description,
        //     fide_id:this.state.fide_id,
        //     lichess_id:this.state.lichess_id,
        //     alt_contact:this.state.alt_contact,
        //     alt_contact_code:this.state.alt_contact_code,
        //     parent: (this.state.parent_is_disabled)? '':this.state.parent,
        //     photo_blob: this.state.photo_blob,
        //     dob:this.state.dob.toISOString().slice(0, 19).replace('T', ' ')
        // }
        // ).then((response) => {
        //     console.log(response);
        //     this.props.onAlert({alert_type:"success",alert_text:config.registrationSuccessfulText});
        // }).catch((error)=>{
        //     console.log(error.response);
        //     if(error.response.data.code === 'ER_DUP_ENTRY'){
        //         this.props.onAlert({alert_type:"warning",alert_text:"E-Mail/Contact in use."});    
        //     }
        //     else{
        //         this.props.onAlert({alert_type:"warning",alert_text:"There was problem processing the request"});
        //     }
        // });
        // this.setState({ registerButtonClicked: true });
        console.log(this.state);
    }

    isRegistrationDisabled(){
        return this.state.registerButtonClicked || 
        this.state.email_is_invalid || 
        this.state.password_is_invalid ||
        this.state.fullname_is_invalid ||
        this.state.contact_code_is_invalid ||
        this.state.contact_is_invalid ||
        this.state.dob_is_invalid ||
        ((this.state.parent_is_disabled)?false:this.state.parent_is_invalid);
    }

    onEmailChange = (ev: any) => {
        this.setState({email: ev.target.value, email_is_invalid:!ev.target.value});
    }

    onPasswordChange = (ev: any) => {
        this.setState({password: ev.target.value, password_is_invalid:!ev.target.value});
    }
    
    onDateChange = (ev:any) => {
        const entered_date:Date = new Date(ev.target.value);
        const today:Date = new Date();
        this.setState({
            dob: entered_date,
            dob_is_invalid: isNaN(entered_date.getDate()) || (entered_date >= today),
            parent_is_disabled: (Math.abs(today.valueOf() - entered_date.valueOf()) /  (1000 * 60 * 60 * 24 * 365)) >= 18
        });
    };

    onFullNameChange = (ev: any)=>{
        this.setState({fullname: ev.target.value, fullname_is_invalid:!ev.target.value});
    }

    onAltContactChange = (ev: any)=>{
        this.setState({alt_contact: ev.target.value});
    }

    onContactChange = (ev: any)=>{
        this.setState({contact: ev.target.value, contact_is_invalid:ev.target.value});
    }

    onAltContactCodeChange = (ev: any)=>{
        this.setState({alt_contact_code: ev.target.value});
    }

    onContactCodeChange = (ev: any)=>{
        console.log(ev);
        this.setState({contact_code: ev.target.value, contact_code_is_invalid:!parseInt(ev.target.value)});
    }

    onLichessIDChange = (ev: any)=>{
        this.setState({lichess_id: ev.target.value});
    }

    onFideIDChange = (ev: any)=>{
        this.setState({fide_id: ev.target.value});
    }

    onCountryChange = (ev: any)=>{
        this.setState({country: ev.target.value, country_is_invalid:(ev.target.value==='Select your Country')});
    }

    onStateChange = (ev: any)=>{
        this.setState({state: ev.target.value, state_is_invalid:(ev.target.value==='Select your State')});
    }

    onDescriptionChange = (ev: any) =>{
        this.setState({description: ev.target.value});
    }

    onParentChange = (ev: any) =>{
        this.setState({parent: ev.target.value, parent_is_invalid:!ev.target.value});
    }

    onPhotoChange = (ev: any) =>{
        this.setState({photo_blob: ev});
        
    }

    showParent(){
        if(!this.state.parent_is_disabled){
            return(
                <div>
                    <Form.Label>Parent Name</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridParent">
                            <Form.Control onChange={this.onParentChange} placeholder="Parent Name" isInvalid={this.state.parent_is_invalid} />
                            <Form.Control.Feedback type="invalid" >
                                Parent Name can't be empty
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                </div>
            );
        }
    }

    render()
    {
        return (
            <Container>
                <Card bg="light" style={{marginTop:'2em'}}>
                    <Card.Header>{config.studentRegistrationText}</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Label>E-Mail and Password</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Control onChange={this.onEmailChange} type="email" placeholder={config.emailPlaceholderText} isInvalid={this.state.email_is_invalid}/>
                                        <Form.Control.Feedback type="invalid" >
                                            Email can't be empty
                                        </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Control onChange={this.onPasswordChange} type="password" placeholder={config.passwordPlaceholderText} isInvalid={this.state.password_is_invalid}/>
                                    <Form.Control.Feedback type="invalid" >
                                        Password can't be empty
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Full Name</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridFullName">                        
                                        <Form.Control onChange={this.onFullNameChange} placeholder={config.fullNameText} isInvalid={this.state.fullname_is_invalid}/>
                                        <Form.Control.Feedback type="invalid" >
                                            Full Name can't be empty
                                        </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Country and State</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridCountry">
                                        <Form.Control custom as="select" onChange={this.onCountryChange} isInvalid={this.state.country_is_invalid} defaultValue={config.countrySelectList[0]}>
                                            {config.countrySelectList.map((option_value:string) => (<option value={option_value} >{option_value}</option>))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid" >
                                            Select your Country
                                        </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                        <Form.Control custom as="select" onChange={this.onStateChange} isInvalid={this.state.state_is_invalid} defaultValue={config.countrySelectList[0]}>
                                            {config.stateSelectList.map((option_value:string) => (<option value={option_value} >{option_value}</option>))}
                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid" >
                                            Select your State
                                        </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Row>
                                <Form.Group sm={4} as={Col} controlId="formGridDOB">
                                    <Form.Control onChange={this.onDateChange} isInvalid={this.state.dob_is_invalid} placeholder="Date of Birth" />
                                    <Form.Control.Feedback type="invalid" >
                                        Enter a valid Date
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group sm={8} as={Col} controlId="formGridState">
                                    <Form.Control readOnly value={this.state.dob.toDateString()}  />
                                </Form.Group>
                            </Form.Row>
                            {this.showParent()}
                            <Form.Label>Contact Number</Form.Label>
                            <Form.Row>
                                <Form.Group sm={4} as={Col} controlId="formGridContact">   
                                    <Form.Control as="select" onChange={this.onContactCodeChange} isInvalid={this.state.contact_code_is_invalid} >
                                        {config.contactCodeSelectList.map((option_value:string) => (<option value={option_value} >{option_value}</option>))}
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        Contact Code cannot be empty
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group sm={8} as={Col} controlId="formGridContact">
                                    <Form.Control onChange={this.onContactChange} placeholder="Number" isInvalid={this.state.contact_is_invalid} />
                                    <Form.Control.Feedback type="invalid">
                                        Contact Number cannot be empty
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Alternate Contact Number</Form.Label>
                            <Form.Row>
                                <Form.Group sm={4} as={Col} controlId="formGridAltContact">
                                    <Form.Control as="select" onChange={this.onAltContactCodeChange} >
                                        {config.contactCodeSelectList.map((option_value:string) => (<option value={option_value} >{option_value}</option>))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group sm={8} as={Col} controlId="formGridContact">
                                    <Form.Control onChange={this.onAltContactChange} placeholder="Number" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Describe yourself</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridDescription">
                                        <Form.Control as="textarea" onChange={this.onDescriptionChange} placeholder="Write something about yourself" />
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Fide ID and Lichess ID</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridFideID">
                                        <Form.Control onChange={this.onFideIDChange} placeholder="Fide ID" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridLichessID">
                                        <Form.Control onChange={this.onLichessIDChange}placeholder="Lichess ID" />
                                </Form.Group>
                            </Form.Row>
                            {/* <Form.Label>User Photo</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} >
                                        <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label="Upload your photo" custom />
                                </Form.Group>
                            </Form.Row> */}
                        </Form>
                        <Button className="float-right" onClick={this.handleRegister} variant="dark" disabled={this.isRegistrationDisabled()}>
                            {config.registerText}
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
}
  