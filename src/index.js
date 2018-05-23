import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route, Switch, withRouter, Redirect } from 'react-router-dom';

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
    }
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

            <Route exact path={ props.match.url } render={ () => <h5>Please select an office from above menu.</h5> } />
            <Route exact path={ `${ props.match.url }/:officeId(us|india)` } component={ Office } />
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
    return state.signedIn ? <h3 style={ {color: 'green'} }>You Are admin now!</h3> : <Redirect to={ {
        pathname: '/signin',
        state: {
            key: 'VALUE'
        }
    } } />;
}

// sign in component
function SignIn( props ) {
    console.log( 'SignIn', props );

    return (
        <div>
            <h3>You need to sign in!</h3>
            <div>
                <SignInButton.WithRouter />
            </div>
        </div>
    );
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