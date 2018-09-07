import React, { Component } from 'react';
import { connect } from 'ract-redux';
import * as actions from '../../actions';

class Signout extends Component {
  componentDidMount() {
    tis.props.signout();
  }
  render() {
    return <div> Sorry to see you go</div>;
  }
}

export default cpnnect(null, actions)(Signout);
