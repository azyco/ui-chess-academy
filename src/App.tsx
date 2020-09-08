import React from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { About } from './pages/About';
import { RegisterStudent } from './pages/RegisterStudent';
import { RegisterCoach } from './pages/RegisterCoach';
import config from './config';

import {Navbar, Nav, Dropdown, Button} from 'react-bootstrap';


class App extends React.Component {
  render() {
    return (
    <Router>
        <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand href="/">{config.websiteName}</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Button variant="dark" href="/profile">Profile</Button>
                <Button variant="dark" href="/login">Login</Button>
                <Dropdown>
                  <Dropdown.Toggle variant="dark" id="dropdown-basic">
                    Register
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="/register_student">Student</Dropdown.Item>
                    <Dropdown.Item href="/register_coach" disabled>Coach</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Button variant="dark" href="/about">About</Button>
              </Nav>
              <Navbar.Text>
                <Image src="" rounded />
                Signed in as: <a href="#login">Mark Otto</a>
              </Navbar.Text>
            </Navbar.Collapse>
        </Navbar>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/profile">
          <Profile />
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
