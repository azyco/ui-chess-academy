import React from 'react';

import { Carousel, Container, Jumbotron } from 'react-bootstrap';
import config from '../config';

export class Home extends React.Component{
    render (){
        return(
            <div>
                <Jumbotron>
                    <h1>{ config.websiteName }</h1>
                    <p>
                        {config.websiteDescription}
                    </p>
                </Jumbotron>
                <Container fluid>
                    <Carousel>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src="home_carousel_placeholder_2.png?text=First Slide&bg=373940"
                            alt="First slide"
                            />
                            <Carousel.Caption>
                            <h3>Welcome to Chess Academy</h3>
                            <p>Happy Learning!</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src="home_carousel_placeholder.jpg?text=Second slide&bg=282c34"
                            alt="Third slide"
                            />

                            <Carousel.Caption>
                            <h3>Second slide label</h3>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src="home_carousel_placeholder_3.jpg?text=Third slide&bg=20232a"
                            alt="Third slide"
                            />

                            <Carousel.Caption>
                            <h3>Third slide label</h3>
                            <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </Container>
            </div>
        )
    }
}
