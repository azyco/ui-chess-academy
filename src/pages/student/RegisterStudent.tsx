import React from 'react';
import Api from '../../api/backend';
import config from '../../config';

import { Container, Form, Button, Card, Col } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterStudentProps = {
    onAlert: Function
}

type RegisterStudentState = {
    fullname: string,
    fullname_is_invalid: boolean,
    country: string,
    state: string,
    city: string,
    pincode: string,
    address: string,
    city_is_invalid: boolean,
    address_is_invalid: boolean,
    pincode_is_invalid: boolean,
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
    parent: string,
    parent_is_invalid: boolean,
    parent_is_disabled: boolean,
    registerButtonClicked: boolean,
    photo_blob: Blob
}

export class RegisterStudent extends React.Component<RegisterStudentProps, RegisterStudentState> {
    constructor(props: RegisterStudentProps) {
        super(props);
        this.state = {
            fullname: "",
            fullname_is_invalid: true,
            country: config.countrySelectList[0],
            state: config.stateSelectList[0],
            city: '',
            pincode: '',
            address: '',
            city_is_invalid: true,
            address_is_invalid: true,
            pincode_is_invalid: true,
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
            parent: "",
            parent_is_invalid: true,
            parent_is_disabled: true,
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
        const encryptedPassword = CryptoJS.SHA1(this.state.password).toString(CryptoJS.enc.Hex);
        const dob_sql = this.state.dob.getFullYear() + "-" + (this.state.dob.getMonth() + 1) + "-" + this.state.dob.getDate();
        const parent = (this.state.parent_is_disabled) ? '' : this.state.parent;
        const country_sql_length = this.state.country.length;
        const country_sql = this.state.country.substring(country_sql_length - 4, country_sql_length - 1);
        Api.post('/student', {
            registration_details: {
                email: this.state.email,
                password: encryptedPassword,
                fullname: this.state.fullname,
                country: country_sql,
                state: this.state.state,
                city: this.state.city,
                address: this.state.address,
                pincode: this.state.pincode,
                contact: this.state.contact,
                contact_code: this.state.contact_code,
                description: this.state.description,
                fide_id: this.state.fide_id,
                lichess_id: this.state.lichess_id,
                alt_contact: this.state.alt_contact,
                alt_contact_code: this.state.alt_contact_code,
                parent: parent,
                user_image: null,
                dob: dob_sql
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: config.registrationSuccessfulText });
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                if (error.response.data.error_code === 'ER_DUP_ENTRY') {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.duplicateEntryText });
                }
                else {
                    this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                }
            }
            else {
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
            this.state.dob_is_invalid ||
            this.state.city_is_invalid ||
            this.state.address_is_invalid ||
            this.state.pincode_is_invalid ||
            ((this.state.parent_is_disabled) ? false : this.state.parent_is_invalid);
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

    onCityChange = (ev: any) => {
        this.setState({ city: ev.target.value, city_is_invalid: (ev.target.value === '') ? true : false });
    }

    onPincodeChange = (ev: any) => {
        const invalid: boolean = ev.target.value.length !== 6 || isNaN(Number(ev.target.value));
        this.setState({ pincode: ev.target.value, pincode_is_invalid: invalid });
    }

    onAddressChange = (ev: any) => {
        this.setState({ address: ev.target.value, address_is_invalid: (ev.target.value === '') ? true : false });
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

    showParent() {
        if (!this.state.parent_is_disabled) {
            return (
                <div>
                    <Form.Label>{config.parentLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridParent">
                            <Form.Control onChange={this.onParentChange} placeholder={config.parentLabel} isInvalid={this.state.parent_is_invalid} />
                            <Form.Control.Feedback type="invalid" >
                                {config.parentInvalidFeedback}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                </div>
            );
        }
    }

    render() {
        return (
            <Container>
                <Card bg="light" style={{ marginTop: '1em' }}>
                    <Card.Header as="h5" >{config.studentRegistrationText}</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Label>{config.emailAndPasswordLabel}</Form.Label>
                            <Form.Row>
                                <Form.Group md={6} as={Col} controlId="formGridEmail">
                                    <Form.Control value={this.state.email} onChange={this.onEmailChange} type="email" placeholder={config.emailPlaceholderText} isInvalid={this.state.email_is_invalid} />
                                    <Form.Control.Feedback type="invalid" >
                                        {config.emailInvalidFeedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group md={6} as={Col} controlId="formGridPassword">
                                    <Form.Control value={this.state.password} onChange={this.onPasswordChange} type="password" placeholder={config.passwordPlaceholderText} isInvalid={this.state.password_is_invalid} />
                                    <Form.Control.Feedback type="invalid" >
                                        {config.passwordInvalidFeedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>{config.fullNameLabel}</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridFullName">
                                    <Form.Control value={this.state.fullname} onChange={this.onFullNameChange} placeholder={config.fullNameLabel} isInvalid={this.state.fullname_is_invalid} />
                                    <Form.Control.Feedback type="invalid" >
                                        {config.fullNameInvalidFeedback}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Label>Address</Form.Label>
                            <Form.Row>
                                <Form.Group lg={6} as={Col} controlId="formGridCountry">
                                    <Form.Control value={this.state.country} custom as="select" onChange={this.onCountryChange}>
                                        {config.countrySelectList.map(this.optionGenerator)}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group lg={6} as={Col} controlId="formGridState">
                                    <Form.Control value={this.state.state} custom as="select" onChange={this.onStateChange} defaultValue={config.countrySelectList[0]}>
                                        {config.stateSelectList.map((this.optionGenerator))}
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group lg={6} as={Col} controlId="formGridCity">
                                    <Form.Control value={this.state.city} onChange={this.onCityChange} placeholder="City" isInvalid={this.state.city_is_invalid} />
                                    <Form.Control.Feedback type="invalid">
                                        City name must be valid
                            </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group lg={6} as={Col} controlId="formGridPincode">
                                    <Form.Control value={this.state.pincode} onChange={this.onPincodeChange} placeholder="Pincode" isInvalid={this.state.pincode_is_invalid} />
                                    <Form.Control.Feedback type="invalid">
                                        Pincode must be valid
                            </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridAddress">
                                    <Form.Control value={this.state.address} as="textarea" onChange={this.onAddressChange} placeholder="Your full address" />
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
                            {this.showParent()}
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
            </Container>
        );
    }
}
