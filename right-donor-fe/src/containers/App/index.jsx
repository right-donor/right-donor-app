import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import { auths } from '../Auth';
import Sidebar from '../../components/Sidebar';

import { withAuthenticator } from 'aws-amplify-react';
import Amplify from 'aws-amplify';
import aws_exports from '../../aws-exports';
Amplify.configure(aws_exports);

class App extends Component {
    render() {
        return(
            <Router>
                <Switch>
                    <Route path='/' render={props => <Sidebar {...props} />} />
                </Switch>
            </Router>
        );
    }
}

export default withAuthenticator(App, {
                                    includeGreetings: false,
                                    authenticatorComponents: auths
});