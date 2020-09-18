import React from 'react';

import { Jumbotron } from 'react-bootstrap';
import config from '../config';

type HomeProps = {

}

type HomeState = {

}

export class Home extends React.Component<HomeProps, HomeState>{
    render (){
        return(
                <Jumbotron >
                    <h1>{ config.websiteName }</h1>
                    <p>
                        {config.websiteDescription}
                    </p>
                </Jumbotron>
        );
    }
}
