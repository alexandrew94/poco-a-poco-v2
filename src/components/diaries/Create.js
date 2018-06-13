import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Auth from '../../lib/Auth';
import Flash from '../../lib/Flash';

class diariesCreate extends React.Component {

  state = {
    displayDate: null,
    expandedMode: false,
    newEntry: {
      timePracticed: 10,
      timeLogged: moment().format('YYYY-MM-DD')
    }
  }

  componentDidMount() {
    this.generateDisplayDate(moment());
  }

  handleChange = ({ target: { name, value } }) => {
    if (name === 'timeLogged') {
      this.setState({ newEntry: { ...this.state.newEntry, displayDate: this.generateDisplayDate(value)}});
    }
    this.setState({ newEntry: { ...this.state.newEntry, [name]: value }});
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .post(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.pieceId}/diary`,
        this.state.newEntry,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(() => {
        Flash.setMessage('success', '✅ Log created!');
        this.props.displayFlashMessages();
        this.closeExpandedMode();
        this.props.componentDidMount();
        this.setState({ newEntry: { timeLogged: moment().format('YYYY-MM-DD'), timePracticed: 10 }});
      })
      .catch(() => {
        Flash.setMessage('danger', '🚫 Minutes Practiced cannot be blank');
        this.props.displayFlashMessages();
      });
  }

  openExpandedMode = e => {
    e.preventDefault();
    this.setState({ expandedMode: true });
  }

  closeExpandedMode = e => {
    e ? e.preventDefault() : null;
    this.setState({ expandedMode: false, newEntry: { ...this.state.newEntry, notes: '' }});
  }

  generateDisplayDate(date) {
    this.setState({ displayDate: moment(date).calendar().split(' at')[0] });
  }

  handleTimePracticedAddition = e => {
    e.preventDefault();
    const newTimePracticed = this.state.newEntry.timePracticed + parseInt(e.target.value);
    console.log(parseInt(e.target.value));
    this.setState({ ...this.state, newEntry: { ...this.state.newEntry, timePracticed: newTimePracticed }});
  }

  render () {
    return(
      <div className="diary-create">
        <form>
          <div className="input-section">
            <label htmlFor="timeLogged">Date Practiced:</label>
            <input type="date" name="timeLogged" onChange={this.handleChange} value={moment().format('YYYY-MM-DD')}/>
            { this.state.displayDate &&
              <small>({this.state.displayDate})</small>
            }
          </div>
          <div className="input-section">
            <label htmlFor="timePracticed">Minutes Practiced:</label>
            <input type="number" name="timePracticed" placeholder="Minutes Practiced" onChange={this.handleChange} value={this.state.newEntry.timePracticed || ''}/>
            <small className="add-and-minus">
              { !this.state.newEntry.timePracticed > 0 &&
                <button disabled value="-5">-5</button>
              }
              { this.state.newEntry.timePracticed > 0 &&
                <button value="-5" onClick={this.handleTimePracticedAddition}>-5</button>
              }
              &nbsp;
              <button value="+5" onClick={this.handleTimePracticedAddition}>+5</button>
            </small>
            { !this.state.expandedMode &&
              <button className="button" onClick={this.openExpandedMode}>
                <i className="fas fa-book"></i>
                &nbsp;
                Include Practice Notes
              </button>
            }
          </div>
          { this.state.expandedMode &&
            <div className="practice-notes">
              <textarea name="notes" placeholder="Practice Notes" onChange={this.handleChange} value={this.state.newEntry.notes || ''}/>
              <button onClick={this.closeExpandedMode}>
                <i className="fas fa-times"></i>
                &nbsp;
                Don&apos;t include practice notes
              </button>
            </div>
          }
          <button className="button" onClick={this.handleSubmit}>
            <i className="fas fa-check"></i>
            &nbsp;
            Submit new entry
          </button>
        </form>
      </div>
    );
  }
}

export default diariesCreate;
