import React from 'react';
import {
    Container,
    Button,
    Col,
    Form, InputGroup,
    Card
} from 'react-bootstrap';

import Api from '../../api/backend';
import config from '../../config';

type userAuthenticationType = {
    id: number,
    user_type: string,
    email: string,
    created_at: number
}

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
}

type ProfileStudentProps = {
    onAlert: Function,
    updateState: Function,
    user_profile: userProfileType,
    user_authentication: userAuthenticationType,
    unauthorizedLogout: Function
}

type ProfileStudentState = {
    profile_edit_mode: boolean,
    fullname: string,
    fullname_is_invalid: boolean,
    state: string,
    description: string,
    fide_id: string,
    lichess_id: string,
    password: string,
    password_is_invalid: boolean,
    dob: Date,
    dob_is_invalid: boolean,
    parent: string,
    parent_is_invalid: boolean,
    parent_is_disabled: boolean,
    photo_blob: Blob,
    is_private_parent: boolean,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean
}

export class ProfileStudent extends React.Component<ProfileStudentProps, ProfileStudentState>{
    constructor(props: ProfileStudentProps) {
        super(props);
        const today: Date = new Date();
        const parent_disabled_test = (Math.abs(today.valueOf() - this.props.user_profile.dob.valueOf()) / (1000 * 60 * 60 * 24 * 365)) >= 18;
        this.state = {
            profile_edit_mode: false,
            fullname: this.props.user_profile.fullname,
            fullname_is_invalid: false,
            state: this.props.user_profile.state,
            description: this.props.user_profile.description,
            fide_id: this.props.user_profile.fide_id,
            lichess_id: this.props.user_profile.lichess_id,
            password: '00000',
            password_is_invalid: false,
            dob: this.props.user_profile.dob,
            dob_is_invalid: false,
            parent: this.props.user_profile.parent,
            parent_is_invalid: (this.props.user_profile.parent) ? false : true,
            parent_is_disabled: parent_disabled_test,
            photo_blob: new Blob(),
            is_private_parent: this.props.user_profile.is_private_parent,
            is_private_contact: this.props.user_profile.is_private_contact,
            is_private_alt_contact: this.props.user_profile.is_private_alt_contact,
            is_private_dob: this.props.user_profile.is_private_dob
        };
    }

    resetState = () => {
        const today: Date = new Date();
        const parent_disabled_test: boolean = (Math.abs(today.valueOf() - this.props.user_profile.dob.valueOf()) / (1000 * 60 * 60 * 24 * 365)) >= 18;
        this.setState({
            profile_edit_mode: false,
            fullname: this.props.user_profile.fullname,
            fullname_is_invalid: false,
            state: this.props.user_profile.state,
            description: this.props.user_profile.description,
            fide_id: this.props.user_profile.fide_id,
            lichess_id: this.props.user_profile.lichess_id,
            password: '00000',
            password_is_invalid: false,
            dob: this.props.user_profile.dob,
            dob_is_invalid: false,
            parent: this.props.user_profile.parent,
            parent_is_invalid: (this.props.user_profile.parent) ? false : true,
            parent_is_disabled: parent_disabled_test,
            photo_blob: new Blob(),
            is_private_parent: this.props.user_profile.is_private_parent,
            is_private_contact: this.props.user_profile.is_private_contact,
            is_private_alt_contact: this.props.user_profile.is_private_alt_contact,
            is_private_dob: this.props.user_profile.is_private_dob
        });
    }

    onDateChange = (ev: any) => {
        const entered_date: Date = new Date(ev.target.value);
        const today: Date = new Date();
        const date_invalid_test = isNaN(entered_date.getDate()) || (entered_date >= today);
        const parent_disabled_test = (Math.abs(today.valueOf() - entered_date.valueOf()) / (1000 * 60 * 60 * 24 * 365)) >= 18;
        this.setState({
            dob: entered_date,
            dob_is_invalid: date_invalid_test,
            parent_is_disabled: parent_disabled_test
        });
    };

    onFullNameChange = (ev: any) => {
        const valid_test = ev.target.value.length >= 2;
        this.setState({ fullname: ev.target.value, fullname_is_invalid: !valid_test });
    }

    onLichessIDChange = (ev: any) => {
        this.setState({ lichess_id: ev.target.value });
    }

    onFideIDChange = (ev: any) => {
        this.setState({ fide_id: ev.target.value });
    }

    onStateChange = (ev: any) => {
        this.setState({ state: ev.target.value });
    }

    onDescriptionChange = (ev: any) => {
        this.setState({ description: ev.target.value });
    }

    onParentChange = (ev: any) => {
        this.setState({ parent: ev.target.value, parent_is_invalid: !ev.target.value });
    }

    onPhotoChange = (ev: any) => {
        this.setState({ photo_blob: ev });

    }

    optionGenerator = (option_value: string) => (
        <option value={option_value} key={option_value}>
            {option_value}
        </option>
    )

    startEdit = () => {
        this.setState({ profile_edit_mode: true });
    }

    togglePrivateDOB = () => {
        this.setState({ is_private_dob: !this.state.is_private_dob });
    }

    togglePrivateParent = () => {
        this.setState({ is_private_parent: !this.state.is_private_parent });
    }

    togglePrivateContact = () => {
        this.setState({ is_private_contact: !this.state.is_private_contact });
    }

    togglePrivateAltContact = () => {
        this.setState({ is_private_alt_contact: !this.state.is_private_alt_contact });
    }

    isEditDisabled() {
        return this.state.fullname_is_invalid ||
            this.state.dob_is_invalid ||
            ((this.state.parent_is_disabled) ? false : this.state.parent_is_invalid);
    }

    editForm = () => {
        const dob_sql = this.state.dob.getFullYear() + "-" + (this.state.dob.getMonth() + 1) + "-" + this.state.dob.getDate();
        const parent = (this.state.parent_is_disabled) ? '' : this.state.parent;
        Api.put('/profile', {
            email: this.props.user_authentication.email,
            updated_user_profile: {
                fullname: this.state.fullname,
                state: this.state.state,
                description: this.state.description,
                fide_id: this.state.fide_id,
                lichess_id: this.state.lichess_id,
                parent: parent,
                photo_blob: this.state.photo_blob,
                dob: dob_sql,
                is_private_parent: this.state.is_private_parent,
                is_private_contact: this.state.is_private_contact,
                is_private_alt_contact: this.state.is_private_alt_contact,
                is_private_dob: this.state.is_private_dob
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: config.updateSuccesfulText });
            this.setState({ profile_edit_mode: false }, () => { this.props.updateState(response) });
        }).catch((error) => {
            console.log(error);
            if(error.response.status === 403){
                this.props.unauthorizedLogout()
            }
            else{
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    showParentUneditable() {
        if (!this.state.parent_is_disabled) {
            return (
                <div>
                    <Form.Label>{config.parentLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridParent">
                            <InputGroup>
                                <Form.Control readOnly value={this.props.user_profile?.parent} />
                                {this.renderPrivateButton(this.props.user_profile.is_private_parent, null, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </div>
            );
        }
    }

    showParentEditable() {
        if (!this.state.parent_is_disabled) {
            return (
                <div>
                    <Form.Label>{config.parentLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridParent">
                            <InputGroup>
                                <Form.Control value={this.state.parent} onChange={this.onParentChange} placeholder={config.parentLabel} isInvalid={this.state.parent_is_invalid} />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {config.parentInvalidFeedback}
                                </Form.Control.Feedback>
                                {this.renderPrivateButton(this.state.is_private_parent, this.togglePrivateParent, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                </div>
            );
        }
    }

    renderPrivateButton(private_state: boolean, onClick: any, disabled: boolean) {
        if (private_state) {
            return (
                <InputGroup.Append>
                    <Button variant="outline-dark" onClick={onClick} disabled={disabled}>Private</Button>
                </InputGroup.Append>
            );
        }
        else {
            return (
                <InputGroup.Append>
                    <Button variant="dark" onClick={onClick} disabled={disabled}>Public</Button>
                </InputGroup.Append>
            );
        }
    }

    uneditableForm() {
        return (
            <div>
                <Form >
                    <Form.Label>{config.emailAndPasswordLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Control readOnly type="email" value={this.props.user_authentication?.email} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.fullNameLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridFullName">
                            <Form.Control readOnly value={this.props.user_profile?.fullname} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.countryAndStateLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group md={6} as={Col} controlId="formGridCountry">
                            <Form.Control readOnly value={this.props.user_profile?.country} />
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId="formGridState">
                            <Form.Control readOnly value={this.props.user_profile?.state} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.dobLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridDate">
                            <InputGroup>
                                <Form.Control readOnly value={this.props.user_profile.dob.toDateString()} />
                                {this.renderPrivateButton(this.props.user_profile.is_private_dob, null, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    {this.showParentUneditable()}
                    <Form.Label>{config.contactLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group xs={3} as={Col} controlId="formGridContactCode">
                            <Form.Control readOnly value={this.props.user_profile?.contact_code} />
                        </Form.Group>
                        <Form.Group xs={9} as={Col} controlId="formGridContact">
                            <InputGroup>
                                <Form.Control readOnly type="number" value={this.props.user_profile?.contact} />
                                {this.renderPrivateButton(this.props.user_profile.is_private_contact, null, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.altContactLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group xs={3} as={Col} controlId="formGridAltContactCode">
                            <Form.Control readOnly value={this.props.user_profile?.alt_contact_code} />
                        </Form.Group>
                        <Form.Group xs={9} as={Col} controlId="formGridAltContact">
                            <InputGroup>
                                <Form.Control readOnly type="number" value={this.props.user_profile?.alt_contact} />
                                {this.renderPrivateButton(this.props.user_profile.is_private_alt_contact, null, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.descriptionLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridDescription">
                            <Form.Control readOnly as="textarea" value={this.props.user_profile?.description} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.fideLichessLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group md={6} as={Col} controlId="formGridFideID">
                            <Form.Control readOnly value={this.props.user_profile?.fide_id} />
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId="formGridLichessID">
                            <Form.Control readOnly value={this.props.user_profile?.lichess_id} />
                        </Form.Group>
                    </Form.Row>
                    {/* <Form.Label>{config.imageLabel}</Form.Label>
                <Form.Row>
                    <Form.Group as={Col} >
                            <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={config.imagePlaceholder} custom />
                    </Form.Group>
                </Form.Row> */}
                </Form>
                <Button className="float-right" onClick={this.startEdit} variant="dark" block>
                    {config.editButtonText}
                </Button>
            </div>
        );
    }

    editableForm() {
        return (
            <div>
                <Form>
                    <Form.Label>{config.emailAndPasswordLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Control readOnly type="email" value={this.props.user_authentication?.email} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.fullNameLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridFullName">
                            <Form.Control value={this.state.fullname} onChange={this.onFullNameChange} placeholder={config.fullNameLabel} isInvalid={this.state.fullname_is_invalid} />
                            <Form.Control.Feedback type="invalid" tooltip>
                                {config.fullNameInvalidFeedback}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.countryAndStateLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group md={6} as={Col} controlId="formGridCountry">
                            <Form.Control readOnly value={this.props.user_profile?.country} />
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId="formGridState">
                            <Form.Control custom as="select" onChange={this.onStateChange} defaultValue={this.props.user_profile.state}>
                                {config.stateSelectList.map((this.optionGenerator))}
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.dobLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group sm={4} as={Col} controlId="formGridDOB">
                            <InputGroup>
                                <Form.Control onChange={this.onDateChange} isInvalid={this.state.dob_is_invalid} placeholder={config.dobLabel} />
                                <Form.Control.Feedback type="invalid" tooltip>
                                    {config.dobInvalidFeedback}
                                </Form.Control.Feedback>
                                {this.renderPrivateButton(this.state.is_private_dob, this.togglePrivateDOB, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                        <Form.Group sm={8} as={Col} controlId="formGridDOBOutput">
                            <Form.Control readOnly value={this.state.dob.toDateString()} />
                        </Form.Group>
                    </Form.Row>
                    {this.showParentEditable()}
                    <Form.Label>{config.contactLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group xs={3} as={Col} controlId="formGridContactCode">
                            <Form.Control readOnly value={this.props.user_profile?.contact_code} />
                        </Form.Group>
                        <Form.Group xs={9} as={Col} controlId="formGridContact">
                            <InputGroup>
                                <Form.Control readOnly type="number" value={this.props.user_profile?.contact} />
                                {this.renderPrivateButton(this.state.is_private_contact, this.togglePrivateContact, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.altContactLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group xs={3} as={Col} controlId="formGridAltContactCode">
                            <Form.Control readOnly value={this.props.user_profile?.alt_contact_code} />
                        </Form.Group>
                        <Form.Group xs={9} as={Col} controlId="formGridAltContact">
                            <InputGroup>
                                <Form.Control readOnly type="number" value={this.props.user_profile?.alt_contact} />
                                {this.renderPrivateButton(this.state.is_private_alt_contact, this.togglePrivateAltContact, !this.state.profile_edit_mode)}
                            </InputGroup>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.descriptionLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridDescription">
                            <Form.Control value={this.state.description} as="textarea" onChange={this.onDescriptionChange} placeholder={config.descriptionPlaceholder} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.fideLichessLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group md={6} as={Col} controlId="formGridFideID">
                            <Form.Control value={this.state.fide_id} onChange={this.onFideIDChange} placeholder={config.fideLabel} />
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId="formGridLichessID">
                            <Form.Control value={this.state.lichess_id} onChange={this.onLichessIDChange} placeholder={config.lichessLabel} />
                        </Form.Group>
                    </Form.Row>
                    {/* <Form.Label>{config.imageLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} >
                                <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={config.imagePlaceholder} custom />
                        </Form.Group>
                    </Form.Row> */}
                </Form>
                <Button className="float-right" onClick={this.editForm} disabled={this.isEditDisabled()} variant="dark" block>
                    {config.saveButtonText}
                </Button>
                <Button className="float-right" onClick={this.resetState} variant="dark" block>
                    {config.cancelButtonText}
                </Button>
            </div>
        );
    }

    render() {
        if (this.state.profile_edit_mode) {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.profileTabHeader}</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            {this.editableForm()}
                        </Container>
                    </Card.Body>
                </Card>
            );
        }
        else {
            return (
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as='h5'>{config.profileTabHeader}</Card.Header>
                    <Card.Body>
                        <Container fluid>
                            {this.uneditableForm()}
                        </Container>
                    </Card.Body>
                </Card>
            );
        }
    }
}