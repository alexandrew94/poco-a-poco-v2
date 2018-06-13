import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import 'bulma';

import './scss/main.scss';

import Home from './components/Home';
import Navbar from './components/Navbar';

import Profile from './components/user/Profile';
import EditProfile from './components/user/Edit';

import Flash from './lib/Flash';

class App extends React.Component {

  state = {
    editingProfile: false,
    messages: null
  }

  editingProfileTrue = () => this.setState({ editingProfile: true });

  editingProfileFalse = () => this.setState({ editingProfile: false });

  displayFlashMessages = () => {
    const messages = Flash.getMessages();

    if(!messages) return false;

    this.setState({ ...this.state, messages });
    Flash.clearMessages();

    setTimeout(() => this.setState({ messages: '' }), 2000);
  }

  render() {
    return (
      <Router>
        <div>
          {this.state.messages && Object.keys(this.state.messages).map(type => {
            return (
              <div key={type} className={`flash-message notification is-${type}`}>
                {this.state.messages[type]}
              </div>
            );
          }
          )}
          <Navbar
            editingProfileStatus={this.state.editingProfile}
            editingProfileTrue={this.editingProfileTrue}
            editingProfileFalse={this.editingProfileFalse}
          />
          <main>
            <Switch>
              <Route
                render={(props) => (
                  <EditProfile {...props}
                    editingProfileFalse={this.editingProfileFalse}
                    displayFlashMessages={this.displayFlashMessages}
                  />
                )}
                path="/profile/edit"
              />
              <Route
                render={(props) => (
                  <Profile {...props} displayFlashMessages={this.displayFlashMessages} />
                )}
                path="/profile"
              />
              <Route
                render={(props) => (
                  <Home {...props} displayFlashMessages={this.displayFlashMessages} />
                )}
                exact path="/"
              />
              <Route
                render={(props) => (
                  <Profile {...props} displayFlashMessages={this.displayFlashMessages} />
                )}
              />
            </Switch>
          </main>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
