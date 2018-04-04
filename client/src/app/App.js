import React from 'react';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {Route, Switch, HashRouter} from 'react-router-dom';
import {composeWithDevTools} from 'redux-devtools-extension';
import axios from 'axios';

import auth from '../utils/auth';

import Home from './Home';
import SideBarContainer from '../sidebar/SidebarContainer';

import Login from '../auth/Login';
import Register from '../auth/Register';

import rootReducer from './reducers';
import { changeSocket } from './socket';

const io = require('socket.io-client');
const socket = io();

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

store.dispatch(changeSocket(socket));

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={props => {
        let {loggedIn} = store.getState().authReducer;
        let {history} = props;
        axios
            .get(`/api/checkCompany/${props.match.params.company}`)
            .then(response => {
                console.log(response);
                if(response && !response.data.success) {
                    auth.logout();
                    history.push('/');
                }
            }).catch(error => {
                console.log(error);
            });
        return (
            loggedIn ? (
                <Component {...props}/>
            ) : (
                <Route component={Login} />
            )
        )}
    }/>
  )

export default class App extends React.Component {
    render() {
        return (
            <HashRouter>
                <Provider store={store}>
                    <div style={{height: '100%'}}>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/signup" component={Register}/>
                            <PrivateRoute path="/:company" component={SideBarContainer} />
                        </Switch>
                    </div>
                </Provider>
            </HashRouter>
        );
    }
}

