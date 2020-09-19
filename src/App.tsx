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

import {Navbar, Nav, NavDropdown} from 'react-bootstrap';

type AppClassProps = {
};

type AppClassState = {
  signed_in: boolean
  username: string
}

class App extends React.Component<AppClassProps, AppClassState>{
  constructor(props:AppClassProps){
    super(props);
    this.state = {
      signed_in: false,
      username: ''
    }
    this.signInPrompt.bind(this.state);
  }

  componentWillMount() {
    Api.get('/profile').then((resp) => {
      console.log(resp.data);
      this.setState({ signed_in: (resp.data.id !== 0), username: resp.data.email });
    }).catch((err) => {
      this.setState({ signed_in: false, username: '' });
    });
  }

  signInPrompt(){
    if (this.state.signed_in){
      return (
        <Navbar.Text>
          {config.loginWelcomeText}, <Link style={{textDecoration: 'none'}} to="/profile">{this.state.username}</Link>
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

  render() {
    return (
    <Router>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">{config.websiteName}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <NavDropdown title={config.registerText} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/register_student">{config.studentText}</NavDropdown.Item>
                  <NavDropdown.Item href="/register_coach" disabled>{config.coachText}</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/about">{config.aboutText}</Nav.Link>
              </Nav>
              {this.signInPrompt()}
            </Navbar.Collapse>
        </Navbar> 
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/profile">
          <Profile profile={{ username: this.state.username }}/>
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register_student">
          <RegisterStudent />
        </Route>
        <Route path="/register_coach">
          <RegisterCoach />
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
