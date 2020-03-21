import React, { Component, Fragment } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import 'react-chat-widget/lib/styles.css';
import './App.css'

import Create from './page/create/Create';
import Join from './page/join/Join';
import Test from './page/test/Test';

class App extends Component {
  render () {
    return (
      <Fragment>
        <Switch>
          <Route path='/create' render={ () => <Create { ...this.props } /> } />
          <Route path='/join' render={ () => <Join { ...this.props } /> } />
          <Route path='/' render={ () => <Test { ...this.props } /> } />
        </Switch>
      </Fragment>
    );
  }
}

export default withRouter(App);