import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch, withRouter, Redirect, Prompt } from 'react-router-dom';

// import stylesheet
import './scss/styles.scss';

// global state
const state = {
    signedIn: false,
    signin: function(){
        this.signedIn = true;
    },
    signout: function(){
        this.signedOut = true;
    },
    preventRedirect: false
};

// Home (landing) component
function Home( props ) {
    return <h1>Home Component</h1>;
}

// About (us) component
function About( props ) {
    return <h1>About Component</h1>;
}

// Contact (us) component
function Contact( props ) {
    return (
        <div>
            <h1>Contact Component</h1>

            <Link to={ `${ props.match.url }/us` }>US Office</Link> &nbsp; &nbsp;
            <Link to={ `${ props.match.url }/india` }>India Office</Link>

            <Switch>
                <Route exact path={ props.match.url } render={ () => <h5>Please select an office from above menu.</h5> } />
                <Route exact path={ `${ props.match.url }/:officeId(us|india)` } component={ Office } />
                <Route render={ () => <Redirect to={ props.match.url } /> } />
            </Switch>
        </div>
    );
}
function Office( props ) {
    return (
        <div>
            <h2>I am <abbr>{ props.match.params.officeId.toUpperCase() }</abbr> office</h2>
        </div>
    );
}

// admin component
function Admin( props ) {
    return state.signedIn ? (
        <div>
            <h3 style={ {color: 'green'} }>You Are admin now!</h3>
            <button onClick={ () => {
                state.signedIn = false;
                props.history.replace('/signin');
            } }>Sign Out</button>
        </div>
    ) : (
        <Redirect to={ {
            pathname: '/signin',
            state: {
                key: 'VALUE'
            }
        } } />
    );
}

// sign in component
class SignIn extends React.Component {
    constructor() {
        super();

        this.state = {
            preventRedirect: false
        };

        this.manageRedirect = this.manageRedirect.bind( this );
    }

    manageRedirect( event ) {
        this.setState({
            ...this.state,
            preventRedirect: event.target.value.length > 0
        });
    }

    render() {
        return (
            <div>
                <h3>You need to sign in!</h3>

                <Prompt when={ this.state.preventRedirect } message="Are you sure, you want to go somewhere else?"/>
    
                <input type="password" onChange={ this.manageRedirect } placeholder="Type a password"/>
    
                <div style={ {marginTop: '10px'} }>
                    <SignInButton.WithRouter />
                </div>
            </div>
        );        
    }
}

function SignInButton( props ) {
    return (
        <button onClick={ () => {
            // call sign in function
            state.signin();
    
            // redirect router to `/admin` url
            props.history.replace('/admin');
        } }>Click to sign in.</button>
    );
}
SignInButton.WithRouter = withRouter( SignInButton );

// Application component
class App extends React.Component {
    constructor() {
        super();
    }

    render(){
        return (
            <div>
                <Router>
                    <div>
                        <div>
                            <Link to="/">Home</Link> &nbsp; &nbsp;
                            <Link to="/about">About</Link> &nbsp; &nbsp;
                            <Link to="/contact">Contact</Link> &nbsp; &nbsp;
                            <Link to="/admin">Admin Area</Link>

                            <hr/>
                        </div>
                        
                        <Switch>
                            <Route exact path="/" component={ Home } />
                            <Route path="/about" component={ About } />
                            <Route path="/contact" component={ Contact } />
                            <Route path="/admin" component={ Admin } />
                            <Route path="/signin" component={ SignIn } />
                            <Route render={ () => <Redirect to="/"/> } />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));