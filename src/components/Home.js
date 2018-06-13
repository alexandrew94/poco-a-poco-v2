import React from 'react';
import { Redirect } from 'react-router-dom';

import Auth from '../lib/Auth';

import Login from './auth/Login';
import Signup from './auth/Signup';

class Home extends React.Component {

  state = {
    mode: 'login'
  }

  handleRedirect = (destination) => {
    this.props.history.push(destination);
  }

  toggleMode = () => {
    this.state.mode === 'login' ? this.setState({ mode: 'signup' }) : this.setState({ mode: 'login' });
  }

  render() {
    if (Auth.isAuthenticated()) {
      return <Redirect to='/profile' />;
    }
    return <div className="landing">
      <div className="title-image" style={{ backgroundImage: 'url(../assets/image/landing-image.png)' }}/>
      <h1>poco a poco</h1>
      <div className="staff">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="authentication-box">
        { this.state.mode === 'login' &&
          <div>
            <Login
              displayFlashMessages={this.props.displayFlashMessages}
              handleRedirect={this.handleRedirect}
            />
            <div className="signup-prompt">
              Don&apos;t have an account?&nbsp;
              <button onClick={this.toggleMode}>
                <i className="fas fa-user-plus"></i>
                &nbsp;
                Signup
              </button>
              &nbsp;instead.
            </div>
          </div>
        }
        { this.state.mode === 'signup' &&
          <div>
            <Signup
              displayFlashMessages={this.props.displayFlashMessages}
              handleRedirect={this.handleRedirect}
            />
            <button className="back-to-login" onClick={this.toggleMode}>
              <i className="fas fa-undo-alt"></i>
              &nbsp;
              Go back to Login
            </button>
          </div>
        }
      </div>
    </div>;
  }
}

export default Home;
