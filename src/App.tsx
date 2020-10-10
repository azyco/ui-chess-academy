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
import { RegisterStudent } from './pages/student/RegisterStudent';
import config from './config';
import Api from './api/backend';

import { Navbar, Nav, Modal, Button, Alert } from 'react-bootstrap';

type userAuthenticationType = {
	id: number,
	user_type: string,
	email: string,
	created_at: string
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

type userProfileResponseType = {
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
	signed_in: boolean,
	user_authentication: userAuthenticationType | null,
	user_profile: userProfileType | null,
	show_alert: boolean,
	alert_text: string,
	alert_type: string,
}

type alertDetailsType = {
	alert_type: string,
	alert_text: string,
}

class App extends React.Component<AppClassProps, AppClassState>{
	constructor(props: AppClassProps) {
		super(props);
		this.state = {
			signed_in: false,
			user_authentication: null,
			user_profile: null,
			show_alert: false,
			alert_text: '',
			alert_type: '',
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

	createAuthenticationState = (loginResponseData: loginResponseType, callback: () => void) => {
		this.setState({ signed_in: (!!loginResponseData.user_authentication), user_authentication: loginResponseData.user_authentication },
			() => {callback()});
	}

	createProfileState = (user_profile_response: userProfileResponseType) => {
		const data: userProfileType = {
			fullname: user_profile_response.fullname,
			country: user_profile_response.country,
			state: user_profile_response.state,
			description: user_profile_response.description,
			user_image: user_profile_response.user_image,
			fide_id: user_profile_response.fide_id,
			lichess_id: user_profile_response.lichess_id,
			contact: user_profile_response.contact,
			contact_code: user_profile_response.contact_code,
			alt_contact: user_profile_response.alt_contact,
			alt_contact_code: user_profile_response.alt_contact_code,
			dob: new Date(user_profile_response.dob),
			parent: user_profile_response.parent,
			is_private_contact: user_profile_response.is_private_contact,
			is_private_alt_contact: user_profile_response.is_private_alt_contact,
			is_private_dob: user_profile_response.is_private_dob,
			is_private_parent: user_profile_response.is_private_parent
		}
		this.setState({ user_profile: data });
	}

	getUserProfile() {
		Api.get('/profile').then((response) => {
			console.log("got user profile ",response);
			this.createProfileState(response.data.user_profile);
		}).catch((error) => {
			if (this.state.user_authentication?.user_type !== 'admin') {
				console.log("Profile failed to load, resetting login: ", error);
				this.setState({ user_authentication: null, user_profile: null });
			}
			else{
				console.log("User is an Admin, no profile");
			}
		});
	}

	componentDidMount() {
		Api.get('/login').then((response) => {
			console.log("Authentication from Session: ",response);
			this.createAuthenticationState(response.data, this.getUserProfile);
		}).catch((error) => {
			console.log("Session Reset: ",error);
			this.setState({ user_authentication: null, user_profile: null });
		});
	}

	loginCallback = (loginResponseData: loginResponseType) => {
		this.createAuthenticationState(loginResponseData, this.getUserProfile);
		console.log("Authentication from Login: ",loginResponseData);
	}

	logoutCallback = () => {
		Api.delete('/login').then(
			(response) => {
				console.log("session and login data deleted ",response);
				this.setState({
					signed_in: false,
					user_authentication: null,
					user_profile: null
				}, () => {
					this.alertCallback({ alert_type: "success", alert_text: "Logged out successfully" })
				});
			}
		).catch((error) => {
			console.log("error during logout ",error)
			this.alertCallback({ alert_type: "warning", alert_text: config.serverDownAlertText });
		});
	}

	updateStateCallback = (response: any) => {
		console.log("Profile State updated ",response);
		this.createProfileState(response.data.user_profile);
	}

	studentRegister() {
		if (!this.state.signed_in) {
			return (<Nav.Link href="/student/register">{config.registerText}</Nav.Link>);
		}
	}

	signInPrompt() {
		if (this.state.signed_in) {
			console.log("user signed in as: ",this.state.user_authentication?.user_type);
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
			if(this.state.alert_type==='warning'){
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
			else{
				return(
					<Alert style={{ marginBottom: 0 }} variant={this.state.alert_type} onClose={() => this.setState({ show_alert: false })} dismissible>
						{this.state.alert_text}
					</Alert>
				);
				
			}
		}
	}

	render() {
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
						<Profile updateState={this.updateStateCallback} onAlert={this.alertCallback} onLogout={this.logoutCallback} user_profile={this.state.user_profile} user_authentication={this.state.user_authentication} />
					</Route>
					<Route path="/login">
						<Login onAlert={this.alertCallback} onLogin={this.loginCallback} />
					</Route>
					<Route path="/student/register">
						<RegisterStudent onAlert={this.alertCallback} />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</Router>
		);
	}
}

export default App;
