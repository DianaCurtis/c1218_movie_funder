import React, { Component } from 'react';
import { Link, Redirect, withRouter } from 'react-router-dom';
import logo from '../../assets/images/ftf_logo_150.png';
import { connect } from 'react-redux';
import { signIn, signOut } from '../../actions';

class Nav extends Component{
    state = {
        active: false,
        topLinks: [
            {
                text: 'New Project',
                to:'/new_project'
            }
        ],
        loggedInLinks: [
            {
                text: 'My Projects',
                to:'/my_projects'
            }
        ],
        bottomLinks: [
            {
                text: 'Contact',
                to:'/contact'
            }, 
            {
                text: 'About Us',
                to:'/about'
            },
            {
                text:'Terms & Conditions',
                to:'/terms'
            }
        ],
        signIn: [
            {
                text: 'Sign In',
                to:'/sign_in'
            }
        ]
    }

    toggleClass = () => {
        const currentState = this.state.active;
        this.setState({ active: !currentState });
    }

    hideNavbar = () => {
        this.setState({ active: false });
    }

    componentWillMount(){
        window.addEventListener('click', this.hideNavbar, true);
    }

    logout = () => {
        this.props.signOut();
        this.props.history.push('/');
    }

    buildLink(link){
        return (
            <Link to= { link.to} key= { link.to } >
                <li>
                    { link.text }
                </li>
            </Link>
        )
    }

    renderLinks(){
        const login = this.props.sign_in.login;
        const {topLinks, loggedInLinks, bottomLinks, signIn} = this.state;

        let activeLinks = [];
        let linkElements = [];

        if(login){
            activeLinks = [...topLinks, ...loggedInLinks, ...bottomLinks];

            linkElements = activeLinks.map(this.buildLink);

            linkElements.push(
                <li key='/sign_out' onClick={this.logout} className='signout-button'>
                  Sign Out      
                </li>
            );
        } else {
            activeLinks = [...topLinks, ...bottomLinks, ...signIn];

            linkElements = activeLinks.map(this.buildLink)
        }

        return linkElements;
    }

    render(){
        const hamburgerBaseClass = 'hamburger hamburger--spin ';
        const hamburgerActive = 'is-active';
        const login = this.props.sign_in.login;

        return(
            <div className='nav-bar-container'>
                <div className='nav-bar'>
                    <button onClick= { this.toggleClass } className= { this.state.active ? (hamburgerBaseClass + hamburgerActive):hamburgerBaseClass } type='button'>
                        <span className='hamburger-box'>
                            <span className='hamburger-inner'></span>
                        </span>
                    </button>

                    <h1 className='terms-header about-header'>{this.props.title}</h1>

                </div>
                <div id='slide-out-menu' className = {this.state.active ? 'active' : '' }>
                    <button onClick= { this.toggleClass } className= { this.state.active ? (hamburgerBaseClass + hamburgerActive):hamburgerBaseClass } type='button'>
                        <span className='hamburger-box'>
                            <span className='hamburger-inner'></span>
                        </span>
                    </button>
                    <div className='login-img-container'>
                        <img className='login-img' src= { logo }/>
                    </div>
                    <div className='welcome-login-header'>
                    {/* h1  will have to be done dynmically once we are able to create a login system
                    that then will be used to pull the users name and email address from the database to the browser */}
                        <h2>{login ? `Welcome ${this.props.sign_in.user.name}!` : 'Fund That Film'}</h2>
                    </div>
                    <div className='slide-out-menu-content-container'>
                        <div className='slide-out-menu-content'>
                            <hr/>
                            { this.renderLinks() }
                        </div>
                    </div>
                </div>
           </div>
        )
    }
  }

const mapStateToProps = state => {
  return {
    sign_in: state.session,
    sign_out: state.session.login
  }
}

export default withRouter(connect(mapStateToProps, { 
    signIn, signOut 
})(Nav)); 
