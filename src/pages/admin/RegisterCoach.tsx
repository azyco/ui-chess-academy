import React from 'react';
import Api from '../../api/backend';
import config from '../../config';

import { Container, Form, Button, Card, Col } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterCoachProps = {
    onAlert: Function
}

type RegisterCoachState = {
    fullname: string,
    fullname_is_invalid: boolean,
    country: string,
    state: string,
    description: string,
    fide_id: string,
    lichess_id: string,
    contact: string,
    contact_is_invalid: boolean,
    contact_code: string,
    alt_contact_is_invalid: boolean,
    alt_contact: string,
    alt_contact_code: string,
    email: string,
    email_is_invalid: boolean,
    password: string,
    password_is_invalid: boolean,
    dob: Date,
    dob_is_invalid: boolean,
    registerButtonClicked: boolean,
    photo_blob: Blob
}

export class RegisterCoach extends React.Component<RegisterCoachProps, RegisterCoachState> {
    constructor(props: RegisterCoachProps) {
        super(props);
        this.state = {
            fullname: "",
            fullname_is_invalid: true,
            country: config.countrySelectList[0],
            state: config.stateSelectList[0],
            description: "",
            fide_id: "",
            lichess_id: "",
            contact: "",
            contact_is_invalid: true,
            contact_code: config.countryCodeSelectList[0],
            alt_contact: "",
            alt_contact_is_invalid: false,
            alt_contact_code: config.countryCodeSelectList[0],
            email: "",
            email_is_invalid: true,
            password: "",
            password_is_invalid: true,
            dob: new Date(),
            dob_is_invalid: true,
            registerButtonClicked: false,
            photo_blob: new Blob()
        };
    }

    handleRegister = () => {
        const encryptedPassword = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex);
        const dob_sql = this.state.dob.getFullYear() + "-" + (this.state.dob.getMonth() + 1) + "-" + this.state.dob.getDate();
        const country_sql_length = this.state.country.length;
        const country_sql = this.state.country.substring(country_sql_length - 4, country_sql_length - 1);
        Api.post('/coach', {
            registration_details: {
                email: this.state.email,
                password: encryptedPassword,
                fullname: this.state.fullname,
                country: country_sql,
                state: this.state.state,
                contact: this.state.contact,
                contact_code: this.state.contact_code,
                description: this.state.description,
                fide_id: this.state.fide_id,
                lichess_id: this.state.lichess_id,
                alt_contact: this.state.alt_contact,
                alt_contact_code: this.state.alt_contact_code,
                photo_blob: this.state.photo_blob,
                dob: dob_sql
            }
        }
        ).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: config.registrationSuccessfulText });
        }).catch((error) => {
            console.log(error);
            if(error.response){
                if (error.response.data.error_code === 'ER_DUP_ENTRY') {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.duplicateEntryText });
                }
                else {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                }
            }
            else{
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
        this.setState({ registerButtonClicked: true });
    }

    isRegistrationDisabled() {
        return this.state.registerButtonClicked ||
            this.state.email_is_invalid ||
            this.state.password_is_invalid ||
            this.state.fullname_is_invalid ||
            this.state.contact_is_invalid ||
            this.state.alt_contact_is_invalid ||
            this.state.dob_is_invalid;
    }

    onEmailChange = (ev: any) => {
        const valid_test = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(ev.target.value);
        this.setState({ email: ev.target.value, email_is_invalid: !valid_test });
    }

    onPasswordChange = (ev: any) => {
        const valid_test = ev.target.value.length >= 6;
        this.setState({ password: ev.target.value, password_is_invalid: !valid_test });
    }

    onDateChange = (ev: any) => {
        const entered_date: Date = new Date(ev.target.value);
        const today: Date = new Date();
        const date_invalid_test = isNaN(entered_date.getDate()) || (entered_date >= today);
        this.setState({
            dob: entered_date,
            dob_is_invalid: date_invalid_test,
        });
    };

    onFullNameChange = (ev: any) => {
        const valid_test = ev.target.value.length >= 2;
        this.setState({ fullname: ev.target.value, fullname_is_invalid: !valid_test });
    }

    onAltContactChange = (ev: any) => {
        const valid_test = (ev.target.value.length >= 10 && ev.target.value.length <= 12) || (ev.target.value === '');
        this.setState({ alt_contact: ev.target.value, alt_contact_is_invalid: !valid_test });
    }

    onContactChange = (ev: any) => {
        const valid_test = (ev.target.value.length >= 10) && (ev.target.value.length <= 12);
        this.setState({ contact: ev.target.value, contact_is_invalid: !valid_test });
    }

    onAltContactCodeChange = (ev: any) => {
        this.setState({ alt_contact_code: (ev.target.value === config.countryCodeSelectList[0]) ? '' : ev.target.value.slice(1) });
    }

    onContactCodeChange = (ev: any) => {
        this.setState({ contact_code: ev.target.value.slice(1) });
    }

    onLichessIDChange = (ev: any) => {
        this.setState({ lichess_id: ev.target.value });
    }

    onFideIDChange = (ev: any) => {
        this.setState({ fide_id: ev.target.value });
    }

    onCountryChange = (ev: any) => {
        this.setState({ country: ev.target.value });
    }

    onStateChange = (ev: any) => {
        this.setState({ state: ev.target.value });
    }

    onDescriptionChange = (ev: any) => {
        this.setState({ description: ev.target.value });
    }

    onPhotoChange = (ev: any) => {
        this.setState({ photo_blob: ev });

    }

    optionGenerator = (option_value: string) => (
        <option value={option_value} key={option_value}>
            {option_value}
        </option>
    )

    render() {
        return (
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as="h5" >{config.coachRegistrationText}</Card.Header>
                <Card.Body>
                    <Form>
                        <Form.Label>{config.emailAndPasswordLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group md={6} as={Col} controlId="formGridEmail">
                                <Form.Control onChange={this.onEmailChange} type="email" placeholder={config.emailPlaceholderText} isInvalid={this.state.email_is_invalid} />
                                <Form.Control.Feedback type="invalid" >
                                    {config.emailInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group md={6} as={Col} controlId="formGridPassword">
                                <Form.Control onChange={this.onPasswordChange} type="password" placeholder={config.passwordPlaceholderText} isInvalid={this.state.password_is_invalid} />
                                <Form.Control.Feedback type="invalid" >
                                    {config.passwordInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.fullNameLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridFullName">
                                <Form.Control onChange={this.onFullNameChange} placeholder={config.fullNameLabel} isInvalid={this.state.fullname_is_invalid} />
                                <Form.Control.Feedback type="invalid" >
                                    {config.fullNameInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.countryAndStateLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group md={6} as={Col} controlId="formGridCountry">
                                <Form.Control custom as="select" onChange={this.onCountryChange}>
                                    {config.countrySelectList.map(this.optionGenerator)}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group md={6} as={Col} controlId="formGridState">
                                <Form.Control custom as="select" onChange={this.onStateChange} defaultValue={config.countrySelectList[0]}>
                                    {config.stateSelectList.map((this.optionGenerator))}
                                </Form.Control>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.dobLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group sm={4} as={Col} controlId="formGridDOB">
                                <Form.Control onChange={this.onDateChange} isInvalid={this.state.dob_is_invalid} placeholder={config.dobLabel} />
                                <Form.Control.Feedback type="invalid" >
                                    {config.dobInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group sm={8} as={Col} controlId="formGridDate">
                                <Form.Control readOnly value={this.state.dob.toDateString()} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.contactLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group xs={4} as={Col} controlId="formGridContactCode">
                                <Form.Control custom as="select" onChange={this.onContactCodeChange} >
                                    {config.countryCodeSelectList.map((this.optionGenerator))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group xs={8} as={Col} controlId="formGridContact">
                                <Form.Control type="number" onChange={this.onContactChange} placeholder={config.contactLabel} isInvalid={this.state.contact_is_invalid} />
                                <Form.Control.Feedback type="invalid">
                                    {config.contactInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.altContactLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group xs={4} as={Col} controlId="formGridAltContactCode">
                                <Form.Control custom as="select" onChange={this.onAltContactCodeChange} >
                                    {config.countryCodeSelectList.map((this.optionGenerator))}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group xs={8} as={Col} controlId="formGridAltContact">
                                <Form.Control type="number" onChange={this.onAltContactChange} placeholder={config.altContactLabel} isInvalid={this.state.alt_contact_is_invalid} />
                                <Form.Control.Feedback type="invalid">
                                    {config.altContactInvalidFeedback}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.descriptionLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group as={Col} controlId="formGridDescription">
                                <Form.Control as="textarea" onChange={this.onDescriptionChange} placeholder={config.descriptionPlaceholder} />
                            </Form.Group>
                        </Form.Row>
                        <Form.Label>{config.fideLichessLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group md={6} as={Col} controlId="formGridFideID">
                                <Form.Control onChange={this.onFideIDChange} placeholder={config.fideLabel} />
                            </Form.Group>
                            <Form.Group md={6} as={Col} controlId="formGridLichessID">
                                <Form.Control onChange={this.onLichessIDChange} placeholder={config.lichessLabel} />
                            </Form.Group>
                        </Form.Row>
                        {/* <Form.Label>{config.imageLabel}</Form.Label>
                        <Form.Row>
                            <Form.Group as={Col} >
                                    <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={config.imagePlaceholder} custom />
                            </Form.Group>
                        </Form.Row> */}
                    </Form>
                    <Button className="float-right" onClick={this.handleRegister} variant="dark" disabled={this.isRegistrationDisabled()}>
                        {config.registerText}
                    </Button>
                </Card.Body>
            </Card>
        );
    }
}
