import React from 'react';
import axios from 'axios';
import moment from 'moment';

import Auth from '../../lib/Auth';
import Flash from '../../lib/Flash';

class diariesShow extends React.Component {
  state = {
    mode: 'show',
    entry: {},
    editedEntry: {}
  }

  componentDidMount() {
    this.generateDisplayDate(moment());
    this.setState({ entry: this.props.data, editedEntry: this.props.data });
  }

  handleShowDetails = () => {
    this.setState({ mode: 'details' });
  }

  handleCloseDetails = () => {
    this.setState({ mode: 'show' });
  }

  handleOpenEditMode = () => {
    this.setState({ mode: 'edit', editedEntry: this.state.entry });
  }

  handleCloseEditMode = e => {
    e.preventDefault();
    this.setState({ mode: 'show', editedEntry: {} });
  }

  handleChange = ({ target: { name, value } }) => {
    name === 'timeLogged' ? this.generateDisplayDate(value) : null;
    this.setState({ editedEntry: { ...this.state.editedEntry, [name]: value }});
  }

  handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.pieceId}/diary/${this.state.editedEntry._id}`, this.state.editedEntry,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(res => {
        Flash.setMessage('success', '✅ Log edited!');
        this.props.displayFlashMessages();
        this.setState({ mode: 'show', entry: res.data });
      })
      .catch(() => {
        Flash.setMessage('danger', '⚠️ Minutes Practiced is required!');
        this.props.displayFlashMessages();
      });
  }

  handleDelete = e => {
    e.preventDefault();
    axios
      .delete(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.pieceId}/diary/${this.state.editedEntry._id}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(() => {
        this.setState({ mode: 'show', entry: {} });
        this.props.componentDidMount();
      });
  }

  generateDiaryDisplayDate(date) {
    if (moment(date).calendar().match(/\//)) {
      return `On ${moment(date).calendar()}`;
    }
    return moment(date).calendar().split(' at')[0];
  }

  generateDisplayDate(date) {
    this.setState({ displayDate: moment(date).calendar().split(' at')[0] });
  }

  render() {
    return(
      <div className="diary-entries">
        { this.state.mode === 'show' &&
          <div>
            {this.state.entry &&
              <div>
                <h4><strong>{this.generateDiaryDisplayDate(this.state.entry.timeLogged)}, you practiced {this.state.entry.timePracticed} mins</strong></h4>
                { this.state.entry.shortNotes && <p>{this.state.entry.shortNotes}</p>}
                <button className="show-details" onClick={this.handleShowDetails}>
                  <i className="fas fa-ellipsis-h"></i>
                </button>
              </div>
            }
          </div>
        }
        { this.state.mode === 'details' &&
          <div>
            {this.state.entry &&
              <div>
                <h4><strong>{this.generateDiaryDisplayDate(this.state.entry.timeLogged)}, you practiced {this.state.entry.timePracticed} mins</strong></h4>
                { this.state.entry.notes && <p>{this.state.entry.notes}</p>}
                <button className="edit" onClick={this.handleOpenEditMode}>
                  <i className="fas fa-edit"></i>&nbsp;Edit
                </button>
                <button className="show-details" onClick={this.handleCloseDetails}>
                  <i className="fas fa-times"></i>
                </button>
              </div>
            }
          </div>
        }
        { this.state.mode === 'edit' &&
          <div className="diary-edit">
            <form>
              <h4><strong>
                <input className="date" type="date" name='timeLogged' value={this.state.editedEntry.timeLogged} onChange={this.handleChange}/>
                { this.state.displayDate &&
                  <span> ({this.generateDiaryDisplayDate(this.state.editedEntry.timeLogged)}) , you practiced </span>
                }
                <input className="minutes" name='timePracticed' value={this.state.editedEntry.timePracticed} onChange={this.handleChange}/><span> mins</span>
              </strong></h4>
              <textarea name='notes' value={this.state.editedEntry.notes} onChange={this.handleChange}/>
              <button className="save" onClick={this.handleSubmit}>
                <i className="fas fa-save"></i>
                &nbsp;
                Save Changes
              </button>
              <button className="delete-button" onClick={this.handleDelete}>
                <i className="fas fa-trash-alt"></i>
                &nbsp;
                Delete This Entry
              </button>
              <button className="close" onClick={this.handleCloseEditMode}>
                <i className="fas fa-times"></i>
                &nbsp;
                Close Without Saving
              </button>
            </form>
          </div>
        }
      </div>
    );
  }
}

export default diariesShow;
