import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Auth from '../../lib/Auth';
import Flash from '../../lib/Flash';
import instruments from '../../lib/Instruments';

class Profile extends React.Component {
  state = {
    user: {},
    editedUser: {}
  }

  componentDidMount() {
    if (!Auth.isAuthenticated()) {
      Flash.setMessage('danger', '⚠️ You must be signed in!');
      this.props.displayFlashMessages();
    } else {
      axios
        .get(`/api/users/${Auth.getPayload().sub}`, { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
        .then(user => this.setState({ user: user.data, editedUser: user.data }));
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ editedUser: { ...this.state.editedUser, [name]: value }});
  }

  handleInstrumentClick = ({ target: { value } }) => {
    if (this.state.editedUser.instruments.map(instrument => instrument.name).includes(value)) {
      const newInstrumentArray = this.state.editedUser.instruments.filter(instrument => {
        return instrument.name !== value;
      });
      return this.setState({ editedUser: { ...this.state.editedUser, instruments: newInstrumentArray }});
    }
    return this.setState({ editedUser: { ...this.state.editedUser, instruments: [ ...this.state.editedUser.instruments, { name: value }]}});
  }

  checkInstrument = value => {
    return this.state.user.instruments.map(instrument => instrument.name).includes(value);
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`/api/users/${Auth.getPayload().sub}/edit`,
        this.state.editedUser,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` }
        })
      .then(() => {
        console.log(this.state.editedUser);
        this.props.history.push('/profile');
        this.props.editingProfileFalse();
      })
      .catch(err => {
        Flash.setMessage('danger', `⚠️ ${err.response.data.errors.username || err.response.data.errors.email}`);
        this.props.displayFlashMessages();
      });
  }

  handleClose = e => {
    e.preventDefault();
    this.props.editingProfileFalse();
    this.props.history.push('/profile');
  };

  render() {
    if (!Auth.isAuthenticated()) {
      return <Redirect to='/' />;
    }
    return (
      <div>
        <form>
          { this.state.user.username &&
            <div className="user-edit">
              <div className="columns">
                <div className="column is-half">
                  <label htmlFor="username">Username:</label>
                  <input
                    name="username"
                    value={this.state.editedUser.username}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="column is-half">
                  <label htmlFor="username">Email:</label>
                  <input
                    name="email"
                    value={this.state.editedUser.email}
                    onChange={this.handleChange}
                  />
                </div>
              </div>
              <div>
                <div className="instrument-choice">
                  <h4>Edit your instruments:</h4>
                  <div className="columns is-multiline">
                    { instruments.map((instrument, i) => {
                      return <div className="column is-one-quarter" key={i}>
                        <div className="instrument-box">
                          <h4>{instrument.emoji}</h4>
                          <h5>{instrument.name}</h5>
                          <input
                            defaultChecked={this.checkInstrument(instrument.name)}
                            onClick={this.handleInstrumentClick}
                            type="checkbox"
                            value={instrument.name}
                            name={instrument.name}
                          />
                        </div>
                      </div>;
                    })}
                  </div>
                </div>
              </div>
              <button
                className="save-changes"
                onClick={this.handleSubmit}
              >
                <i className="fas fa-save"></i>
                &nbsp;
                Save Changes
              </button>
              <button
                className="close-without-saving"
                onClick={this.handleClose}>
                <i className="fas fa-undo"></i>
                &nbsp;
                Close without saving
              </button>
            </div>
          }
        </form>
      </div>
    );
  }
}

export default Profile;
