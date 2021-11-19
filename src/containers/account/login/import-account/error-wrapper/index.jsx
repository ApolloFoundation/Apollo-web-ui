/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */


import React from 'react';

export default class ErrorWrapper extends React.Component {
  state = { hasError: false }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
  }

  render() {
    if (this.state.hasError) {
      return (<h2>Oops something went wrong. Please reload page</h2>);
    }
    return this.props.children;
  }
}
