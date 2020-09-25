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
import { RegisterCoach } from './pages/coach/RegisterCoach';
import config from './config';
import Api from './api/backend';

import {Navbar, Nav, Alert} from 'react-bootstrap';

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

type loginResponseType = {
  user_details: userDetailsType,
}

type AppClassProps = {

};

type AppClassState = {
  signed_in: boolean,
  user_details: userDetailsType|null,
  show_alert: boolean,
  alert_text: string,
  alert_type: string
}

type alertDetailsType = {
  alert_type: string,
  alert_text: string,
}

class App extends React.Component<AppClassProps, AppClassState>{
  constructor(props:AppClassProps){
    super(props);
    this.state = {
      signed_in: false,
      user_details: null,
      show_alert: false,
      alert_text: '',
      alert_type: ''
    }
    this.signInPrompt.bind(this.state);
    this.studentRegister.bind(this.state);
    this.renderAlert.bind(this.state);
  }

  componentWillMount() {
    Api.get('/profile').then((resp) => {
      console.log(resp.data);
      this.createLoginState(resp.data);
    }).catch((error) => {
      console.log("Session Reset\n",error);
      this.setState({ user_details: null });
    });
  }

  logoutCallback = () => {
    Api.delete('/login').then(
      (response)=>{
        console.log(response);
        this.setState({
          signed_in: false,
          user_details: null
        });
        this.alertCallback({alert_type:"success", alert_text:"Logged out successfully"});
      }
    ).catch((error)=>{
      console.log(error.response)
      this.alertCallback({alert_type:"warning",alert_text:config.serverDownAlertText});
    });
  }

  loginCallback = (loginInfo: loginResponseType) => {
    this.createLoginState(loginInfo);
  }

  /**
   * This function will set the global state from the http response data
   * the http response data is available from the backend API response.
   * @param loginResponseInfo HTTP response struct with login data
   */
  createLoginState = (loginResponseInfo: loginResponseType) => {
    this.setState({signed_in: (!!loginResponseInfo.user_details), user_details: loginResponseInfo.user_details },()=>{console.log(this.state.signed_in);});
  }

  studentRegister(){
    if (!this.state.signed_in){
      return(<Nav.Link href="/student/register">{config.registerText}</Nav.Link>);
    }
  }

  signInPrompt(){
    if (this.state.signed_in){
      return (
        <Navbar.Text>
          {config.loginWelcomeText}, <Link style={{textDecoration: 'none'}} to="/profile">{this.state.user_details?.fullname}</Link>
        </Navbar.Text>
        );
    }
    else{
      return (
        <Navbar.Text>
          <Link style={{textDecoration: 'none'}} to="/login">{config.loginText}</Link>
        </Navbar.Text>
        );
    }
  }

  alertCallback = (alert_details:alertDetailsType) => {
    this.setState({show_alert:true, alert_text:alert_details.alert_text, alert_type:alert_details.alert_type});
  }

  renderAlert(){
    if(this.state.show_alert){
      return (
      <Alert variant={this.state.alert_type} onClose={() => this.setState({show_alert:false})}  dismissible>
        {this.state.alert_text}
      </Alert>
      );
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
          <Profile onAlert={this.alertCallback} onLogout={this.logoutCallback} user_details={this.state.user_details} />
        </Route>
        <Route path="/login">
          <Login onAlert={this.alertCallback} onLogin={this.loginCallback}/>
        </Route>
        <Route path="/student/register">
          <RegisterStudent onAlert={this.alertCallback}/>
        </Route>
        <Route path="/coach/register">
          <RegisterCoach onAlert={this.alertCallback}/>
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
