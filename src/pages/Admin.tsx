import React from 'react';

import config from '../config';
 
type AdminProps = {
    onAlert: Function,
    onLogout: any,
    user_details: userDetailsType |null
}

type AdminState = {

}

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

export class Admin extends React.Component<AdminProps, AdminState>{
    constructor(props:AdminProps){
        super(props);
    }

    render (){
        return(
            <div>
            </div>
        )
    }
}
