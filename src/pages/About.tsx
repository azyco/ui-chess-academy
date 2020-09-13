import React from 'react';

import { Container, Jumbotron } from 'react-bootstrap';
import config from '../config';

export class About extends React.Component
{
    render (){
        return(
        <Container fluid>
            <Jumbotron>
                <h1>About {config.websiteName}</h1>
                <p>
                    {config.aboutDescription}
                </p>
            </Jumbotron>
        </Container>
        )
    }
}