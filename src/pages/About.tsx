import React from 'react';

import { Container, Jumbotron, Card } from 'react-bootstrap';
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
                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>

                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>

                <Card style={{marginTop:'2em'}}>
                <Card.Img variant="top" src="" />
                <Card.Body>
                    <Card.Title>Card Title</Card.Title>
                    <Card.Text>
                    Some quick example text to build on the card title and make up the bulk of
                    the card's content.
                    </Card.Text>
                </Card.Body>
                </Card>
            </Container>
        )
    }
}