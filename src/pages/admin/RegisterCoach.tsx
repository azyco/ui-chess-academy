import React from 'react';
import Api from '../../api/backend';
import config from '../../config';

import { Container, Form, Button, Card, Col, Collapse } from 'react-bootstrap';
import CryptoJS from 'crypto-js';

type RegisterCoachProps = {
    onAlert: Function,
    updateCoachArray: Function,
    unauthorizedLogout: Function
}

type RegisterCoachState = {
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
    fide_title: string,
    peak_rating: string,
    current_rating: string,
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
    dob_input: string,
    dob: Date,
    dob_is_invalid: boolean,
    user_image: File | null,
    user_image_is_invalid: boolean,
    successful_students: string,
    exp_trainer: string,
    perf_highlights: string,
    fees: string,
    fees_is_invalid: boolean,
    bank_details: string,
    bank_details_is_invalid: boolean,
    show_form: boolean
}

export class RegisterCoach extends React.Component<RegisterCoachProps, RegisterCoachState> {
    constructor(props: RegisterCoachProps) {
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
            fide_title: '',
            peak_rating: '',
            current_rating: '',
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
            dob_input: '',
            dob_is_invalid: true,
            user_image: null,
            user_image_is_invalid: true,
            successful_students: '',
            exp_trainer: '',
            perf_highlights: '',
            fees: '',
            fees_is_invalid: true,
            bank_details: '',
            bank_details_is_invalid: true,
            show_form: false
        };
    }

    resetState = () => {
        this.setState({
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
            dob_input: '',
            dob_is_invalid: true,
            user_image: null,
            user_image_is_invalid: true,
            show_form: false
        });
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
                user_image: null,
                dob: dob_sql,
                fide_title: this.state.fide_title,
                peak_rating: this.state.peak_rating,
                current_rating: this.state.current_rating,
                perf_highlights: this.state.perf_highlights,
                exp_trainer: this.state.exp_trainer,
                successful_students: this.state.successful_students,
                fees: this.state.fees,
                bank_details: this.state.bank_details,
            }
        }
        ).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: config.registrationSuccessfulText });
            this.resetState();
            this.props.updateCoachArray();
        }).catch((error) => {
            console.log(error);
            if (error.response) {
                if (error.response.status === 403) {
                    this.props.unauthorizedLogout();
                }
                else {
                    if (error.response.data.error_code === 'ER_DUP_ENTRY') {
                        this.props.onAlert({ alert_type: "warning", alert_text: config.duplicateEntryText });
                    }
                    else {
                        this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
                    }
                }
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
    }

    isRegistrationDisabled() {
        return this.state.email_is_invalid ||
            this.state.password_is_invalid ||
            this.state.fullname_is_invalid ||
            this.state.contact_is_invalid ||
            this.state.alt_contact_is_invalid ||
            this.state.dob_is_invalid ||
            this.state.city_is_invalid ||
            this.state.address_is_invalid ||
            this.state.pincode_is_invalid ||
            this.state.fees_is_invalid ||
            // this.state.user_image_is_invalid ||
            this.state.bank_details_is_invalid;
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
            dob_input: ev.target.value,
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

    onCityChange = (ev: any) => {
        this.setState({ city: ev.target.value, city_is_invalid: (ev.target.value === '') ? true : false });
    }

    onPincodeChange = (ev: any) => {
        this.setState({ pincode: ev.target.value, pincode_is_invalid: (ev.target.value === '') ? true : false });
    }

    onAddressChange = (ev: any) => {
        this.setState({ address: ev.target.value, address_is_invalid: (ev.target.value === '') ? true : false });
    }

    onDescriptionChange = (ev: any) => {
        this.setState({ description: ev.target.value });
    }

    onExpTrainerChange = (ev: any) => {
        this.setState({ exp_trainer: ev.target.value });
    }

    onPerfHighlightsChange = (ev: any) => {
        this.setState({ perf_highlights: ev.target.value });
    }

    onSuccessfulStudentsChange = (ev: any) => {
        this.setState({ successful_students: ev.target.value });
    }

    onFideTitleChange = (ev: any) => {
        this.setState({ fide_title: ev.target.value });
    }

    onPeakRatingChange = (ev: any) => {
        this.setState({ peak_rating: ev.target.value });
    }

    onCurrentRatingChange = (ev: any) => {
        this.setState({ current_rating: ev.target.value });
    }

    onFeesChange = (ev: any) => {
        this.setState({ fees: ev.target.value, fees_is_invalid: (ev.target.value === '') ? true : false });
    }

    onBankDetailsChange = (ev: any) => {
        this.setState({ bank_details: ev.target.value, bank_details_is_invalid: (ev.target.value === '') ? true : false });
    }

    onPhotoChange = (ev: any) => {
        this.setState({
            user_image: ev.target.files[0],
            user_image_is_invalid: (!ev.target.files[0] || ev.target.files[0].type !== 'image/jpeg')
        });
    }

    optionGenerator = (option_value: string) => (
        <option value={option_value} key={option_value}>
            {option_value}
        </option>
    )

    renderForm() {
        return (
            <Container>
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
                            <Form.Control value={this.state.address} as="textarea" onChange={this.onAddressChange} placeholder="Your full address" isInvalid={this.state.address_is_invalid} />
                            <Form.Control.Feedback type="invalid" >
                                Address must be valid
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.dobLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group sm={4} as={Col} controlId="formGridDOB">
                            <Form.Control value={this.state.dob_input} onChange={this.onDateChange} isInvalid={this.state.dob_is_invalid} placeholder={config.dobLabel} />
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
                            <Form.Control value={this.state.contact_code} custom as="select" onChange={this.onContactCodeChange} >
                                {config.countryCodeSelectList.map((this.optionGenerator))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group xs={8} as={Col} controlId="formGridContact">
                            <Form.Control value={this.state.contact} type="number" onChange={this.onContactChange} placeholder={config.contactLabel} isInvalid={this.state.contact_is_invalid} />
                            <Form.Control.Feedback type="invalid">
                                {config.contactInvalidFeedback}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>{config.altContactLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group xs={4} as={Col} controlId="formGridAltContactCode">
                            <Form.Control value={this.state.alt_contact_code} custom as="select" onChange={this.onAltContactCodeChange} >
                                {config.countryCodeSelectList.map((this.optionGenerator))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group xs={8} as={Col} controlId="formGridAltContact">
                            <Form.Control value={this.state.alt_contact} type="number" onChange={this.onAltContactChange} placeholder={"Whatsapp Number"} isInvalid={this.state.alt_contact_is_invalid} />
                            <Form.Control.Feedback type="invalid">
                                {config.altContactInvalidFeedback}
                            </Form.Control.Feedback>
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
                    <Form.Row>
                        <Form.Group lg={4} as={Col} controlId="formGridFideTitle">
                            <Form.Control value={this.state.fide_title} onChange={this.onFideTitleChange} placeholder="Fide Title" />
                        </Form.Group>
                        <Form.Group lg={4} as={Col} controlId="formGridPeakRating">
                            <Form.Control value={this.state.peak_rating} onChange={this.onPeakRatingChange} placeholder="Peak Rating" />
                        </Form.Group>
                        <Form.Group lg={4} as={Col} controlId="formGridCurrentRating">
                            <Form.Control value={this.state.current_rating} onChange={this.onCurrentRatingChange} placeholder="Current Rating" />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Performance Highlights</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPerformanceHighlights">
                            <Form.Control value={this.state.perf_highlights} as="textarea" onChange={this.onPerfHighlightsChange} placeholder={"Performance Highlights"} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Experience as a trainer</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridExperienceasatrainer">
                            <Form.Control value={this.state.exp_trainer} as="textarea" onChange={this.onExpTrainerChange} placeholder={"Experience as a trainer"} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Successful Students</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridSuccessfulstudents">
                            <Form.Control value={this.state.successful_students} as="textarea" onChange={this.onSuccessfulStudentsChange} placeholder={"Successful Students"} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Fees</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridFFees">
                            <Form.Control value={this.state.fees} onChange={this.onFeesChange} placeholder="Fees" isInvalid={this.state.fees_is_invalid} />
                            <Form.Control.Feedback type="invalid">
                                Fees must be valid
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Bank Details</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridSuccessfulstudents">
                            <Form.Control value={this.state.bank_details} as="textarea" onChange={this.onBankDetailsChange} placeholder={"Bank Details"} isInvalid={this.state.bank_details_is_invalid} />
                            <Form.Control.Feedback type="invalid">
                                Bank Details must be valid
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    {/* <Form.Label>{config.imageLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={(this.state.user_image) ? (this.state.user_image_is_invalid) ? config.imageInvalidFeedback : this.state.user_image.name : config.imagePlaceholder} custom isInvalid={this.state.user_image_is_invalid} />
                        </Form.Group>
                    </Form.Row> */}
                </Form>
                <Button className="float-right" block onClick={this.handleRegister} variant="dark" disabled={this.isRegistrationDisabled()}>
                    {config.registerText}
                </Button>
                <Button className="float-right" block onClick={this.resetState} variant="dark" >
                    Cancel
                </Button>
            </Container>
        );
    }

    render() {
        return (
            <Card bg="light" style={{ marginTop: '1em' }}>
                <Card.Header as="h5" >{config.coachRegistrationText}</Card.Header>
                <Card.Body>
                    <Collapse in={!this.state.show_form} >
                        <Container>
                            <Button variant="dark" block onClick={() => { this.setState({ show_form: true }) }}>
                                Add Coach
                            </Button>
                        </Container>
                    </Collapse>
                    <Collapse in={this.state.show_form}>
                        {this.renderForm()}
                    </Collapse>
                </Card.Body>
            </Card>
        );
    }
}
