import React from 'react';
import Auth from '../../lib/Auth';
import axios from 'axios';

import DiariesShow from '../diaries/Show';
import DiariesCreate from '../diaries/Create';

import PieceLine from '../graphs/PieceLine';

import Flash from '../../lib/Flash';

class PiecesShow extends React.Component {
  state = {
    editMode: false,
    editedPiece: {},
    piece: {
      suggestedComposer: ''
    }
  }

  componentDidMount = () => {
    axios
      .get(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.piece}`,
        { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(res => this.setState({ piece: res.data, editedPiece: res.data }));
  }

  componentDidUpdate = () => {
    if (this.props.piece !== this.state.piece._id) {
      axios
        .get(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.piece}`,
          { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
        .then(res => this.setState({ piece: res.data, editedPiece: res.data }));
    }
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ editedPiece: { ...this.state.piece, [name]: value }}, () => console.log(this.state));
    if (name === 'composer' && value) {
      const formattedValue = value.split(' ').join('%20');
      axios
        .get(`/api/wikimedia/composers/${formattedValue}`)
        .then(res => {
          if (res.data.query.redirects) {
            this.setState({ editedPiece: { ...this.state.editedPiece, suggestedComposer: res.data.query.redirects[0].to}});
          } else {
            this.setState({ editedPiece: { ...this.state.editedPiece, suggestedComposer: '' }});
          }
        });
    }
  }

  handleSuggestedComposer = () => {
    this.setState({ ...this.state, editedPiece: { ...this.state.editedPiece, composer: this.state.editedPiece.suggestedComposer }});
  }

  findSelectedInstrument = formInstrument => this.state.piece.instrument === formInstrument;

  handleSubmit = e => {
    e.preventDefault();
    axios
      .put(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.piece}`, this.state.editedPiece, {
        headers: { Authorization: `Bearer ${Auth.getToken()}`}
      })
      .then(res => {
        const piece = res.data;
        this.setState({ piece });
      })
      .then(() => {
        Flash.setMessage('success', '✅ Piece edited!');
        this.props.displayFlashMessages();
        this.setState({ editMode: false });
        this.componentDidMount();
      })
      .catch(() => {
        Flash.setMessage('danger', '⚠️ Title is required!');
        this.props.displayFlashMessages();
      });
  }

  handleDelete = () => {
    axios
      .delete(`/api/users/${Auth.getPayload().sub}/pieces/${this.props.piece}`, {
        headers: { Authorization: `Bearer ${Auth.getToken()}` }
      })
      .then(() => {
        this.props.handlePieceShowClose();
      });
  }

  toggleEdit = () => {
    this.setState({ editMode: !this.state.editMode });
  }

  reformatMinutes = (timeInMinutes) => {
    return timeInMinutes / 60 > 1 ? `${Math.floor(timeInMinutes/60)} hours, ${timeInMinutes % 60} mins` : `${timeInMinutes} mins`;
  }

  render() {
    return (
      <div>
        { !this.state.editMode &&
          <div>
            <h1 className="main-title">{this.state.piece.title} Stats</h1>
            <div className="total-practiced">
              <h3>A total of</h3>
              <h2>{this.reformatMinutes(this.state.piece.totalPracticed)}</h2>
              <h3>practiced since {this.state.piece.startedAt}</h3>
            </div>
            <div className="columns">
              <div className="left-column column is-half">
                <h2><strong>Composer:</strong> {this.state.piece.composer}</h2>
                <h3><strong>Instrument:</strong> {this.state.piece.instrument}</h3>
              </div>
              <div className="right-column column is-half">
                <h2>{this.state.piece.description}</h2>
              </div>
            </div>
            <div className="line-graph">
              { this.state.piece.title && <PieceLine
                piece={this.state.piece}
              /> }
            </div>
            <DiariesCreate
              pieceId={this.state.piece._id}
              displayFlashMessages={this.props.displayFlashMessages}
              componentDidMount={this.componentDidMount}
            />
            { this.state.piece.diary && this.state.piece.diary.sort((a, b) => {
              return a.timeLogged < b.timeLogged;
            }).map(entry => {
              return (
                <DiariesShow
                  key={entry._id}
                  pieceId={this.state.piece._id}
                  displayFlashMessages={this.props.displayFlashMessages}
                  componentDidMount={this.componentDidMount}
                  data={entry}
                />
              );
            })
            }
            <button className="edit-button button" onClick={this.toggleEdit}>
              <i className="fas fa-edit"></i>
              &nbsp;Edit Piece
            </button>
          </div>
        }
        { this.state.editMode &&
          <div className="edit-piece">
            <div className="title-box">
              <div className="field">
                <label htmlFor="title">Title</label>
                <input name="title" value={this.state.editedPiece.title} onChange={this.handleChange} />
              </div>
              <div className="field">
                <label htmlFor="composer">Composer</label>
                <input name="composer" value={this.state.editedPiece.composer} onChange={this.handleChange}></input>
                { this.state.editedPiece.composer && this.state.editedPiece.suggestedComposer &&
                  <p className="autocorrect">Did you mean:
                    &nbsp;
                  <span onClick={this.handleSuggestedComposer}>
                    {this.state.editedPiece.suggestedComposer}
                  </span>?
                    &nbsp;
                  </p>
                }
              </div>
              <div className="field">
                <label htmlFor="instrument">Instrument</label>
                <select name="instrument" onChange={this.handleChange}>
                  { this.props.user.instruments.map((instrument, i) => {
                    return <option
                      selected={this.findSelectedInstrument(instrument.name)}
                      key={i}
                      value={instrument.name}>
                      {instrument.name}
                    </option>;
                  })}
                </select>
              </div>
            </div>
            <label htmlFor="description">Description</label>
            <textarea name="description" value={this.state.editedPiece.description} onChange={this.handleChange}></textarea>
            <button className="submit" onClick={this.handleSubmit}>
              <i className="fas fa-check"></i>
              &nbsp;
              Submit Changes
            </button>
            <button className="delete-button" onClick={this.handleDelete}>
              <i className="fas fa-trash-alt"></i>
              &nbsp;
              Delete Piece
            </button>
            <button className="close" onClick={this.toggleEdit}>
              <i className="fas fa-times"></i>
              &nbsp;
              Close Without Saving
            </button>
          </div>
        }
      </div>
    );
  }
}

export default PiecesShow;
