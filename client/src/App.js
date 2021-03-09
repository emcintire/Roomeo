import React, { Component } from 'react';
import './App.css';
import CreateAccount from './components/CreateAccount';
import Login from './components/Login';

class App extends Component {

  render() {
    return (
      <>
        <CreateAccount />
        <Login />
      </>
    );
  }
}

export default App;
