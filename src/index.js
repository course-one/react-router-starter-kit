import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, NavLink, Route, Switch, Redirect, Prompt } from 'react-router-dom';

import './scss/styles.scss';

// application state
const AppState = {
    loggedIn: false,
    login: function(){
        this.loggedIn = true;
    },
    logout: function(){
        this.loggedIn = false;
    }
};

/*----------------------------------------------*/

// NavLinks to house navigation links
function NavLinks() {
    return(
        <div className="links">
            <NavLink exact to="/" className="link" activeClassName="active">Home</NavLink>
            <NavLink to="/about" className="link">About</NavLink>
            <NavLink to="/contact" className="link">Contact Us</NavLink>
            <NavLink to="/admin" className="link">Admin</NavLink>
        </div>
    );
}

/*----------------------------------------------*/

// views
const Home = () => <h1>Home Component</h1>;
const About = ( props ) => <h1>About Component</h1>;

class Admin extends React.Component {
    constructor( props ) {
        super( props );
    }

    logout() {
        AppState.logout();
        this.props.history.replace( '/login' );
    }

    render() {
        return (
            AppState.loggedIn ? (
                <div>
                    <h1>Admin Component</h1>
                    <button onClick={ this.logout.bind(this) }>Logout</button>
                </div>
            ) : <Redirect to="/login" />
        );
    }
}

class Login extends React.Component {
    constructor( props ) {
        super( props );

        this.state = {
            password: '',
            showPromptOnNav: false
        };
    }

    savePassword( event ) {
        this.setState({
            password: event.target.value,
            showPromptOnNav: event.target.value.length > 0
        });
    }

    handleFormSubmit( event ) {
        event.preventDefault();

        if( this.state.password == 'password' ) {
            AppState.login();
            this.props.history.replace( '/admin' );
        }
        else{
            alert('Password is wrong.');
        }
    }

    render() {
        return (
            <form onSubmit={ this.handleFormSubmit.bind( this ) }>
                <h3>Please sign in</h3>
                
                <input type="password" 
                placeholder="Type password" 
                value={ this.state.password } 
                onChange={ this.savePassword.bind( this ) }/>

                <button type="submit"> Submit </button>

                <Prompt when={ this.state.showPromptOnNav }
                message="Are you sure? Your data will be lost."/>
            </form>
        );
    }
}

const Contact = ( props ) => (
    <div>        
        <h1>Contact Component</h1>

        <div className="links">
            <NavLink to={ `${props.match.url}/india` }
            className="link">India Office</NavLink>

            <NavLink to={ `${props.match.url}/us` }
            className="link">Us Office</NavLink>
        </div>

        <Switch>
            <Route exact path={ props.match.url }
            render={ () => <h4>Please select an office.</h4> }/>

            <Route path={ `${props.match.url}/:location(india|us)` }
            component={ ContactInfo }/>
            
            <Route render={ () => <h2>No office found.</h2> }/>
        </Switch>
    </div>
);

const ContactInfo = ( props ) => <h1>Welcome to { props.match.params.location } office.</h1>;

/*----------------------------------------------*/

// application entry component
class App extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (
            <Router>
                <div>
                    <NavLinks />

                    <div className="views">
                        <Switch>
                            <Route exact={ true } path="/" component={ Home }/>
                            <Route path="/about" component={ About }/>
                            <Route path="/contact" component={ Contact }/>
                            <Route path="/admin" component={ Admin }/>
                            <Route path="/login" component={ Login }/>
                            <Route render={ () => <h1>404 Error</h1> } />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

/*******************************************/

ReactDOM.render( <App />, document.getElementById( 'app' ) );