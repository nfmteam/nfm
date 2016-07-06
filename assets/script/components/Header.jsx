import React, { Component } from 'react';

export default class Header extends Component {
    render() {
        return (
            <header className='main-header'>
                <a href='javascript;' className='logo'>
                    <span className='logo-lg'><b>N</b>FM</span>
                </a>
                <nav className='navbar navbar-static-top'>
                    <div className='navbar-custom-menu'>
                        <ul className='nav navbar-nav'>
                            <li className='user user-menu'>
                                <a href='javascript;'>
                                    <i className='fa fa-user'/>
                                    <span>Alexander Pierce</span>
                                </a>
                            </li>
                            <li>
                                <a href='javascript;' className='sign-out'>
                                    <i className='fa fa-sign-out'/>
                                    Sign out
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}