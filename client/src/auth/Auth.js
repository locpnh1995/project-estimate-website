import React from 'react';
import {connect} from 'react-redux';
import {
    Container,
    Button,
    Checkbox,
    Form,
    Segment,
    Header,
    Input,
    Message
} from 'semantic-ui-react';
import {login, register} from './AuthActions';
import auth from '../utils/auth';
