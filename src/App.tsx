import React from 'react';
import './App.css';

import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { ClassroomClass } from './pages/ClassroomClass';
import { RegisterStudent } from './pages/student/RegisterStudent';
import config from './config';
import Api from './api/backend';

import { Navbar, Nav, Modal, Button, Alert } from 'react-bootstrap';

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

type userProfileResponseType = {
	fullname: string,
	country: string,
	state: string,
	city: string,
	pincode: string,
	address: string,
	description: string,
	user_image: File,
	fide_id: string,
	lichess_id: string,
	contact: string,
	contact_code: string,
	alt_contact: string,
	alt_contact_code: string,
	dob: string,
	parent: string,
	is_private_contact: boolean,
	is_private_alt_contact: boolean,
	is_private_dob: boolean,
	is_private_parent: boolean
}

type loginResponseType = {
	user_authentication: userAuthenticationType,
}

type AppClassProps = {

};

type AppClassState = {
	user_authentication: userAuthenticationType | null,
	user_profile: userProfileType | null,
	coach_extras: coachExtras | null,
	show_alert: boolean,
	alert_text: string,
	alert_type: string,
	user_authorization_check_complete: boolean
}

type alertDetailsType = {
	alert_type: string,
	alert_text: string,
}

class App extends React.Component<AppClassProps, AppClassState>{
	constructor(props: AppClassProps) {
		super(props);
		this.state = {
			user_authentication: null,
			user_profile: null,
			coach_extras: null,
			show_alert: false,
			alert_text: '',
			alert_type: '',
			user_authorization_check_complete: false
		}
		this.signInPrompt.bind(this.state);
		this.studentRegister.bind(this.state);
		this.renderAlert.bind(this.state);
		this.getUserProfile = this.getUserProfile.bind(this);
	}

	/**
	 * This function will set the global state from the http response data
	 * the http response data is available from the backend API response.
	 * @param loginResponseInfo HTTP response struct with login data
	 */

	createAuthenticationAndProfileState = (user_profile_response: userProfileResponseType, loginResponseData: loginResponseType, coach_extras: coachExtras | null = null) => {
		const data: userProfileType = { ...user_profile_response, dob: new Date(user_profile_response.dob) }
		console.log("set authentication and profile data")
		this.setState({
			user_profile: data,
			user_authorization_check_complete: true,
			user_authentication: loginResponseData.user_authentication,
			coach_extras
		});
	}

	createAuthenticationState = (loginResponseData: loginResponseType) => {
		console.log("set authentication data")
		this.setState({
			user_authorization_check_complete: true,
			user_authentication: loginResponseData.user_authentication
		});
	}

	getUserProfile(loginResponseData: loginResponseType) {
		if (loginResponseData.user_authentication.user_type !== 'admin') {
			Api.get('/profile').then((profile_response) => {
				console.log("got user profile ", profile_response);
				if (loginResponseData.user_authentication.user_type === 'coach') {
					this.createAuthenticationAndProfileState(profile_response.data.user_profile, loginResponseData, profile_response.data.coach_extras);
				} else {
					this.createAuthenticationAndProfileState(profile_response.data.user_profile, loginResponseData);
				}
			}).catch((error) => {
				console.log("Profile failed to load, resetting login: ", error);
				this.setState({
					user_authentication: null,
					user_profile: null,
					coach_extras: null,
					user_authorization_check_complete: true
				});
			});
		}
		else {
			console.log("User is an Admin, no profile");
			this.createAuthenticationState(loginResponseData);
		}

	}

	componentDidMount() {
		Api.get('/login').then((response) => {
			console.log("Authentication from Session: ", response);
			this.getUserProfile(response.data)
		}).catch((error) => {
			console.log("Session Reset: ", error);
			this.setState({
				user_authentication: null,
				user_profile: null,
				user_authorization_check_complete: true
			});
		});
	}

	loginCallback = (loginResponseData: loginResponseType) => {
		this.getUserProfile(loginResponseData)
		console.log("Authentication from Login: ", loginResponseData);
	}

	logoutCallback = () => {
		Api.delete('/login').then(
			(response) => {
				console.log("session and login data deleted ", response);
				this.setState({
					user_authentication: null,
					user_profile: null
				}, () => {
					this.alertCallback({ alert_type: "success", alert_text: "Logged out successfully" })
				});
			}
		).catch((error) => {
			console.log("error during logout ", error)
			this.alertCallback({ alert_type: "warning", alert_text: config.serverDownAlertText });
		});
	}

	unauthorizedLogout = () => {
		Api.delete('/login').then(
			(response) => {
				console.log("session and login data deleted ", response);
				this.setState({
					user_authentication: null,
					coach_extras: null,
					user_profile: null
				}, () => {
					this.alertCallback({ alert_type: "warning", alert_text: "Please log in." });
				});
			}).catch((error) => {
				console.log("session and login data deleted ", error);
				this.setState({
					user_authentication: null,
					coach_extras: null,
					user_profile: null,
				}, () => {
					this.alertCallback({ alert_type: "warning", alert_text: "Please log in." });
				});
			});

	}

	updateProfileStateCallback = () => {
		Api.get('/profile').then((profile_response) => {
			console.log("got updated user profile ", profile_response);
			const data: userProfileType = { ...profile_response.data.user_profile, dob: new Date(profile_response.data.user_profile.dob) }
			if (this.state.user_authentication?.user_type === 'coach') {
				this.setState({
					user_profile: data,
					coach_extras: profile_response.data.coach_extras,
				});
			} else {
				this.setState({
					user_profile: data,
					coach_extras: null,
				});
			}
		}).catch((error) => {
			console.log("Profile failed to load, resetting login: ", error);
			this.setState({
				user_authentication: null,
				user_profile: null,
				coach_extras: null,
				user_authorization_check_complete: true
			});
		});
	}

	studentRegister() {
		if (!this.state.user_authentication) {
			return (<Nav.Link href="/student/register">{config.registerText}</Nav.Link>);
		}
	}

	signInPrompt() {
		if (this.state.user_authentication) {
			console.log("user signed in as: ", this.state.user_authentication?.user_type);
			const username = (this.state.user_authentication?.user_type === 'admin') ? this.state.user_authentication.email : this.state.user_profile?.fullname;
			return (
				<Navbar.Text>
					{config.loginWelcomeText}, <Link style={{ textDecoration: 'none' }} to="/profile">{username}</Link>
				</Navbar.Text>
			);
		}
		else {
			return (
				<Navbar.Text>
					<Link style={{ textDecoration: 'none' }} to="/login">{config.loginText}</Link>
				</Navbar.Text>
			);
		}
	}

	alertCallback = (alert_details: alertDetailsType) => {
		this.setState({ show_alert: true, alert_text: alert_details.alert_text, alert_type: alert_details.alert_type });
	}

	renderAlert() {
		if (this.state.show_alert) {
			if (this.state.alert_type === 'warning') {
				return (
					<Modal show={this.state.show_alert} onHide={() => this.setState({ show_alert: false })} size="sm" centered>
						<Modal.Body>{this.state.alert_text}</Modal.Body>
						<Modal.Footer>
							<Button variant="secondary" onClick={() => this.setState({ show_alert: false })} block>
								Close
							</Button>
						</Modal.Footer>
					</Modal>
				);
			}
			else {
				return (
					<Alert style={{ marginBottom: 0 }} variant={this.state.alert_type} onClose={() => this.setState({ show_alert: false })} dismissible>
						{this.state.alert_text}
					</Alert>
				);

			}
		}
	}

	render() {
		const got_auth_and_profile = (!!this.state.user_authentication && !!this.state.user_profile) || this.state.user_authentication?.user_type === 'admin';
		return (
			<Router>
				<Navbar bg="dark" variant="dark" expand="lg">
					<Navbar.Brand href="/">{config.websiteName}</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							{this.studentRegister()}
							<Nav.Link href="/about">{config.aboutText}</Nav.Link>
						</Nav>
						{this.signInPrompt()}
					</Navbar.Collapse>
				</Navbar>
				{this.renderAlert()}
				<Switch>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/profile">
						<Profile
							unauthorizedLogout={this.unauthorizedLogout}
							user_authorization_check_complete={this.state.user_authorization_check_complete}
							updateState={this.updateProfileStateCallback}
							onAlert={this.alertCallback}
							onLogout={this.logoutCallback}
							user_profile={this.state.user_profile}
							coach_extras={this.state.coach_extras}
							user_authentication={this.state.user_authentication} />
					</Route>
					<Route path="/login" render={(props) =>
						<Login {...props}
							got_auth_and_profile={got_auth_and_profile}
							user_authorization_check_complete={this.state.user_authorization_check_complete}
							is_logged_in={this.state.user_authentication ? true : false}
							onAlert={this.alertCallback} onLogin={this.loginCallback} />}>
					</Route>
					<Route path="/student/register">
						<RegisterStudent onAlert={this.alertCallback} />
					</Route>
					<Route path="/class/:class_hash" render={(props) =>
						<ClassroomClass {...props}
							onAlert={this.alertCallback}
							user_profile={this.state.user_profile}
							user_authentication={this.state.user_authentication}
							user_authorization_check_complete={this.state.user_authorization_check_complete} />} />
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Router>
		);
	}
}

export default App;
