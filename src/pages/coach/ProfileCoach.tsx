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
	city: string,
	pincode: string,
	address: string,
	description: string,
	user_image: File | null,
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

type coachExtras = {
    fide_title: string,
    peak_rating: string,
    current_rating: string,
    successful_students: string,
    exp_trainer: string,
    perf_highlights: string,
    fees: string,
    bank_details: string,
    parent: string,
}

type ProfileCoachProps = {
    onAlert: Function,
    user_authentication: userAuthenticationType,
    user_profile: userProfileType,
    updateState: Function,
    unauthorizedLogout: Function,
    coach_extras: coachExtras,
}

type ProfileCoachState = {
    profile_edit_mode: boolean,
    fullname: string,
    fullname_is_invalid: boolean,
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
    dob: Date,
    dob_is_invalid: boolean,
    user_image: File | null,
    is_private_contact: boolean,
    is_private_alt_contact: boolean,
    is_private_dob: boolean,
    user_image_is_invalid: boolean,
    successful_students: string,
    exp_trainer: string,
    perf_highlights: string,
    fees: string,
    fees_is_invalid: boolean,
    bank_details: string,
    bank_details_is_invalid: boolean,
}

export class ProfileCoach extends React.Component<ProfileCoachProps, ProfileCoachState>{
    constructor(props: ProfileCoachProps) {
        super(props);
        this.state = {
            profile_edit_mode: false,
            fullname: this.props.user_profile.fullname,
            fullname_is_invalid: false,
            state: this.props.user_profile.state,
            description: this.props.user_profile.description,
            fide_id: this.props.user_profile.fide_id,
            city: this.props.user_profile.city,
            pincode: this.props.user_profile.pincode,
            address: this.props.user_profile.address,
            city_is_invalid: false,
            address_is_invalid: false,
            pincode_is_invalid: false,
            fide_title: this.props.coach_extras.fide_title,
            peak_rating: this.props.coach_extras.peak_rating,
            current_rating: this.props.coach_extras.current_rating,
            lichess_id: this.props.user_profile.lichess_id,
            dob: this.props.user_profile.dob,
            dob_is_invalid: false,
            user_image: null,
            is_private_contact: this.props.user_profile.is_private_contact,
            is_private_alt_contact: this.props.user_profile.is_private_alt_contact,
            is_private_dob: this.props.user_profile.is_private_dob,
            user_image_is_invalid: false,
            successful_students: this.props.coach_extras.successful_students,
            exp_trainer: this.props.coach_extras.exp_trainer,
            perf_highlights: this.props.coach_extras.perf_highlights,
            fees: this.props.coach_extras.fees,
            fees_is_invalid: false,
            bank_details: this.props.coach_extras.bank_details,
            bank_details_is_invalid: false,
        };
    }

    resetState = () => {
        this.setState({
            profile_edit_mode: false,
            fullname: this.props.user_profile.fullname,
            fullname_is_invalid: false,
            state: this.props.user_profile.state,
            description: this.props.user_profile.description,
            fide_id: this.props.user_profile.fide_id,
            city: this.props.user_profile.city,
            pincode: this.props.user_profile.pincode,
            address: this.props.user_profile.address,
            city_is_invalid: false,
            address_is_invalid: false,
            pincode_is_invalid: false,
            fide_title: this.props.coach_extras.fide_title,
            peak_rating: this.props.coach_extras.peak_rating,
            current_rating: this.props.coach_extras.current_rating,
            lichess_id: this.props.user_profile.lichess_id,
            dob: this.props.user_profile.dob,
            dob_is_invalid: false,
            user_image: null,
            user_image_is_invalid: false,
            is_private_contact: this.props.user_profile.is_private_contact,
            is_private_alt_contact: this.props.user_profile.is_private_alt_contact,
            is_private_dob: this.props.user_profile.is_private_dob,
            successful_students: this.props.coach_extras.successful_students,
            exp_trainer: this.props.coach_extras.exp_trainer,
            perf_highlights: this.props.coach_extras.perf_highlights,
            fees: this.props.coach_extras.fees,
            fees_is_invalid: false,
            bank_details: this.props.coach_extras.bank_details,
            bank_details_is_invalid: false,
        });
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

    onLichessIDChange = (ev: any) => {
        this.setState({ lichess_id: ev.target.value });
    }

    onFideIDChange = (ev: any) => {
        this.setState({ fide_id: ev.target.value });
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

    startEdit = () => {
        this.setState({ profile_edit_mode: true });
    }

    togglePrivateDOB = () => {
        this.setState({ is_private_dob: !this.state.is_private_dob });
    }

    togglePrivateContact = () => {
        this.setState({ is_private_contact: !this.state.is_private_contact });
    }

    togglePrivateAltContact = () => {
        this.setState({ is_private_alt_contact: !this.state.is_private_alt_contact });
    }

    isEditDisabled() {
        return this.state.fullname_is_invalid ||
            this.state.city_is_invalid ||
            this.state.address_is_invalid ||
            this.state.pincode_is_invalid ||
            this.state.fees_is_invalid ||
            // this.state.user_image_is_invalid ||
            this.state.bank_details_is_invalid;
    }

    editForm = () => {
        const dob_sql = this.state.dob.getFullYear() + "-" + (this.state.dob.getMonth() + 1) + "-" + this.state.dob.getDate();
        Api.put('/profile', {
            email: this.props.user_authentication.email,
            updated_user_profile: {
                fullname: this.state.fullname,
                state: this.state.state,
                city: this.state.city,
                address: this.state.address,
                pincode: this.state.pincode,
                description: this.state.description,
                fide_id: this.state.fide_id,
                lichess_id: this.state.lichess_id,
                parent: '',
                user_image: null,
                dob: dob_sql,
                is_private_parent: true,
                is_private_contact: this.state.is_private_contact,
                is_private_alt_contact: this.state.is_private_alt_contact,
                is_private_dob: this.state.is_private_dob,
                fide_title: this.state.fide_title,
                peak_rating: this.state.peak_rating,
                current_rating: this.state.current_rating,
                perf_highlights: this.state.perf_highlights,
                exp_trainer: this.state.exp_trainer,
                successful_students: this.state.successful_students,
                fees: this.state.fees,
                bank_details: this.state.bank_details,
            }
        }).then((response) => {
            console.log(response);
            this.props.onAlert({ alert_type: "success", alert_text: config.updateSuccesfulText });
            this.setState({ profile_edit_mode: false }, () => { this.props.updateState(); });
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 403) {
                this.props.unauthorizedLogout();
            }
            else {
                this.props.onAlert({ alert_type: "warning", alert_text: config.serverDownAlertText });
            }
        });
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
                    <Form.Label>Address</Form.Label>
                    <Form.Row>
                        <Form.Group md={6} as={Col} controlId="formGridCountry">
                            <Form.Control readOnly value={this.props.user_profile?.country} />
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId="formGridState">
                            <Form.Control readOnly value={this.props.user_profile?.state} />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group lg={6} as={Col} controlId="formGridCity">
                            <Form.Control value={this.props.user_profile.city} readOnly/>
                        </Form.Group>
                        <Form.Group lg={6} as={Col} controlId="formGridPincode">
                            <Form.Control value={this.props.user_profile.pincode} readOnly/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridAddress">
                            <Form.Control value={this.props.user_profile.address} as="textarea" readOnly/>
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
                    <Form.Row>
                        <Form.Group lg={4} as={Col} controlId="formGridFideTitle">
                            <Form.Control value={this.props.coach_extras.fide_title} readOnly />
                        </Form.Group>
                        <Form.Group lg={4} as={Col} controlId="formGridPeakRating">
                            <Form.Control value={this.props.coach_extras.peak_rating} readOnly/>
                        </Form.Group>
                        <Form.Group lg={4} as={Col} controlId="formGridCurrentRating">
                            <Form.Control value={this.props.coach_extras.current_rating} readOnly/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Performance Highlights</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridPerformanceHighlights">
                            <Form.Control value={this.props.coach_extras.perf_highlights} as="textarea" readOnly />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Experience as a trainer</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridExperienceasatrainer">
                            <Form.Control value={this.props.coach_extras.exp_trainer} as="textarea" readOnly />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Successful Students</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridSuccessfulstudents">
                            <Form.Control value={this.props.coach_extras.successful_students} as="textarea" readOnly />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Fees</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridFFees">
                            <Form.Control value={this.props.coach_extras.fees} readOnly />
                        </Form.Group>
                    </Form.Row>
                    <Form.Label>Bank Details</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridBankDetails">
                            <Form.Control value={this.props.coach_extras.bank_details} as="textarea" readOnly />
                        </Form.Group>
                    </Form.Row>
                    {/* <Form.Label>{config.imageLabel}</Form.Label>
                    <Form.Row>
                        <Form.Group as={Col} >
                            <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={(this.state.user_image) ? (this.state.user_image_is_invalid) ? config.imageInvalidFeedback : this.state.user_image.name : config.imagePlaceholder} custom isInvalid={this.state.user_image_is_invalid} />
                        </Form.Group>
                    </Form.Row> */}
                </Form>
                <Button className="float-right" onClick={this.startEdit} variant="dark" block>
                    Edit
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
                    <Form.Label>Address</Form.Label>
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
                                <Form.File type="file" id="formGridphoto" onChange={this.onPhotoChange} label={config.imagePlaceholder} custom />
                        </Form.Group>
                    </Form.Row> */}
                </Form>
                <Button className="float-right" onClick={this.editForm} disabled={this.isEditDisabled()} variant="dark" block>
                    Save
                </Button>
                <Button className="float-right" onClick={this.resetState} variant="dark" block>
                    Cancel
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