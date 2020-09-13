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
            </div>
        );
    }
}
