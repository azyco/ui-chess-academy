import React from 'react';

import { Container, Jumbotron, Card } from 'react-bootstrap';
import config from '../config';

export class About extends React.Component
{
    render (){
        return(
            <div>
            <Jumbotron>
                <h1>{config.aboutText} {config.websiteName}</h1>
                <p>
                    {config.aboutDescription}
                </p>
            </Jumbotron>
            <Container fluid>
                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>{config.aboutCardTitle1}</Card.Title>
                    <Card.Text>
                        {config.aboutCardBody1}
                    </Card.Text>
                </Card.Body>
                </Card>

                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>{config.aboutCardTitle2}</Card.Title>
                    <Card.Text>
                        {config.aboutCardBody2}
                    </Card.Text>
                </Card.Body>
                </Card>

                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>{config.aboutCardTitle3}</Card.Title>
                    <Card.Text>
                        {config.aboutCardBody3}
                    </Card.Text>
                </Card.Body>
                </Card>
            </Container>
            </div>
        )
    }
}