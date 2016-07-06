import React, { Component } from 'react';

export default class Footer extends Component {

    render() {
        const year = new Date().getFullYear();

        return (
            <footer className='main-footer'>
                <strong>Copyright © {year} NFM.</strong> All rights reserved.
            </footer>
        );
    }

}