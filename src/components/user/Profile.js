import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import _ from 'lodash';
import Auth from '../../lib/Auth';
import instrumentsLibrary from '../../lib/Instruments';

import PiecesShow from '../pieces/Show';

import LineGraph from '../graphs/Line';
import PieChart from '../graphs/Pie';

import Flash from '../../lib/Flash';

class Profile extends React.Component {
  state = {
    createdMode: false,
    search: '',
    newPiece: {
      suggestedComposer: '',
      composer: '',
      startedAt: moment().format('YYYY-MM-DD')
    },
    pieceShow: null,
    user: null
  }

  componentDidMount() {
    if (!Auth.isAuthenticated()) {
      Flash.setMessage('danger', '⚠️ You must be signed in!');
      this.props.displayFlashMessages();
    } else {
      axios
        .get(`/api/users/${Auth.getPayload().sub}`, { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
        .then(res => {
          this.setState({ user: res.data });
        });
    }
  }

  handlePieceShow = ({ target: { value } }) => {
    this.setState({ createMode: false, pieceShow: value });
  }

  handlePieceShowClose = () => {
    axios
      .get(`/api/users/${Auth.getPayload().sub}/pieces`, { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(res => {
        this.componentDidMount();
        this.setState({ pieces: res.data, pieceShow: null });
      });
  }

  toggleCreateMode = () => {
    this.setState({ createMode: !this.state.createMode, pieceShow: null });
  }

  handleCreateChange = ({ target: { name, value }}) => {
    this.setState({ newPiece: { ...this.state.newPiece, [name]: value }});
    if (name === 'composer' && value) {
      const formattedValue = value.split(' ').join('%20');
      axios
        .get(`/api/wikimedia/composers/${formattedValue}`)
        .then(res => {
          if (res.data.query.redirects) {
            this.setState({ newPiece: { ...this.state.newPiece, suggestedComposer: res.data.query.redirects[0].to}});
          } else {
            this.setState({ newPiece: { ...this.state.newPiece, suggestedComposer: '' }});
          }
        });
    }
  }

  handleSuggestedComposer = () => {
    this.setState({ ...this.state, newPiece: { ...this.state.newPiece, composer: this.state.newPiece.suggestedComposer }});
  }

  handleCreateSubmit = () => {
    axios
      .post(`/api/users/${Auth.getPayload().sub}/pieces`, this.state.newPiece, { headers: { Authorization: `Bearer ${Auth.getToken()}` }})
      .then(res => {
        console.log(this.state.newPiece);
        Flash.setMessage('success', '✅ Piece created!');
        this.props.displayFlashMessages();
        this.setState({ createMode: false, pieces: res.data.pieces });
        this.componentDidMount();
      })
      .catch(() => {
        Flash.setMessage('danger', '⚠️ Title and instrument are required!');
        this.props.displayFlashMessages();
      });
  }

  reformatMinutes = (timeInMinutes) => {
    return timeInMinutes / 60 > 1 ? `${Math.floor(timeInMinutes/60)} hours, ${timeInMinutes % 60} mins` : `${timeInMinutes} mins`;
  }

  getInstrumentEmoji = (name) => {
    return instrumentsLibrary.filter(instrument => instrument.name === name)[0].emoji;
  }

  handleSearchChange = ({ target: { value }}) => {
    this.setState({ ...this.state, search: value });
  }

  filteredPieces = () => {
    const re = new RegExp(this.state.search, 'i');
    const filtered = _.filter(this.state.user.pieces, piece => {
      return re.test(piece.title) || re.test(piece.composer) || re.test(piece.instrument) || re.test(piece.description);
    });
    return _.orderBy(filtered);
  }

  render() {
    if (!Auth.isAuthenticated()) {
      return <Redirect to='/' />;
    }
    return (
      <div>
        { this.state.user &&
          <div>
            <header>
              <div className="page-title">
                <h1>poco a poco</h1>
              </div>
              <div className="stave"/>
              <div className="stave"/>
              <div className="stave"/>
              <div className="stave"/>
              <div className="stave"/>
            </header>
            <div className="stats" id="stats">
              <div className="columns first-row">
                <div className="column is-6 total-panel">
                  <h2 className="title">
                    <i className="fas fa-chart-line"></i>
                    &nbsp;
                    Stats for {this.state.user.username}
                  </h2>
                  <div className="total">
                    <h3>A total of</h3>
                    <h2>{this.reformatMinutes(this.state.user.totalPracticed)}</h2>
                    <h3>practiced since {this.state.user.accountCreated}</h3>
                  </div>
                </div>
                <div className="column is-6 pie">
                  <h2>Your Instruments</h2>
                  <PieChart user={this.state.user} />
                </div>
              </div>
              <div className="second-row">
                <LineGraph user={this.state.user} />
              </div>
            </div>
            <div className="logs" id="history">
              <div className="columns">
                <div className="column is-6 left-column">
                  <h2 className="title">
                    <i className="fas fa-history"></i>
                    &nbsp;
                    History of {this.state.user.username}
                  </h2>
                  <h3>My instruments:</h3>
                  <div className="scroll-container instruments-log">
                    { this.state.user.instruments.sort((a, b) => {
                      return a.playingTime < b.playingTime;
                    }).map((instrument, i) => {
                      return <div key={i}>
                        { instrument.playingTime > 0 &&
                          <p key={i}>
                            <strong>
                              {this.getInstrumentEmoji(instrument.name)}
                              {instrument.name}:&nbsp;
                            </strong>
                            practiced for {this.reformatMinutes(instrument.playingTime)} in total
                          </p>
                        }
                      </div>;
                    })}
                  </div>
                  <h3>My composers:</h3>
                  <div className="scroll-container composers-log">
                    { this.state.user.composersLog && Object.keys(this.state.user.composersLog).sort((a, b) => {
                      return this.state.user.composersLog[a] < this.state.user.composersLog[b];
                    }).map((logKey, i) => {
                      if (logKey !== 'undefined') {
                        return <p key={i}>
                          <strong>{logKey}: </strong>
                          practiced for {this.reformatMinutes(this.state.user.composersLog[logKey])}
                        </p>;
                      }
                    }) }
                  </div>
                </div>
                <div className="column is-6 right-column">
                  <h3>My practice log:</h3>
                  <div className="scroll-container practice-log">
                    { this.state.user.practiceLog && Object.keys(this.state.user.practiceLog).sort().reverse().map((logKey, i) => {
                      return <p key={i}>
                        <strong>{logKey}: </strong>
                        {this.reformatMinutes(this.state.user.practiceLog[logKey])}
                      </p>;
                    }) }
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
        { this.state.createMode &&
          <div className="modal is-active piece-create">
            <div className="modal-background"></div>
            <div className="modal-content">
              <button onClick={this.toggleCreateMode} className="modal-close is-large" aria-label="close"></button>
              <div className="title-box">
                <div className="field">
                  <label htmlFor="title">Title:</label>
                  <input name="title" onChange={this.handleCreateChange} />
                </div>
                <div className="field">
                  <label htmlFor="composer">Composer:</label>
                  <input value={this.state.newPiece.composer} name="composer" onChange={this.handleCreateChange} />
                  { this.state.newPiece.composer && this.state.newPiece.suggestedComposer &&
                    <p className="autocorrect">Did you mean:
                      &nbsp;
                    <span onClick={this.handleSuggestedComposer}>
                      {this.state.newPiece.suggestedComposer}
                    </span>?
                      &nbsp;
                    </p>
                  }
                </div>
                <div className="field">
                  <label htmlFor="instrument">Instrument:</label>
                  <select name="instrument" onChange={this.handleCreateChange}>
                    <option disabled selected>Select an instrument</option>;
                    { this.state.user.instruments.map((instrument, i) => {
                      return <option key={i} value={instrument.name}>{instrument.name}</option>;
                    })}
                  </select>
                </div>
              </div>
              <label htmlFor="description">Description:</label>
              <textarea name="description" onChange={this.handleCreateChange}></textarea>
              <button onClick={this.handleCreateSubmit}>
                <i className="fas fa-check"></i>
                &nbsp;
                Submit new piece
              </button>
            </div>
          </div>
        }
        { this.state.pieceShow &&
          <div className="modal is-active">
            <div className="modal-background"></div>
            <div className="modal-content">
              <button onClick={this.handlePieceShowClose} className="modal-close is-large" aria-label="close"></button>
              <PiecesShow
                user={this.state.user}
                displayFlashMessages={this.props.displayFlashMessages}
                handlePieceShowClose={this.handlePieceShowClose}
                piece={this.state.pieceShow}
              />
            </div>
          </div>
        }
        <div className="pieces">
          <h2 className="title">
            <i className="fas fa-music"></i>
            &nbsp;
            My Pieces
          </h2>
          <div className="search">
            <i className="fas fa-search"></i>
            &nbsp;
            <input placeholder="Search" onChange={this.handleSearchChange} autoFocus/>
          </div>
          <div className="columns is-multiline">
            <div className="column is-one-third create-new">
              <div>
                <button onClick={this.toggleCreateMode}>
                  <i className="fas fa-plus"></i>
                </button>
                <h2 id="pieces">Create New Piece</h2>
              </div>
            </div>
            { this.state.user && this.filteredPieces().map(piece =>
              <div className="column is-one-third" key={piece._id}>
                <div className="title-box">
                  { piece.composer && <h2>{piece.composer}:</h2>}
                  <h3>{piece.title}</h3>
                  <h4>({piece.instrument})</h4>
                </div>
                <div className="description-box">
                  <p>{piece.shortDescription}</p>
                </div>
                <button value={piece._id} onClick={this.handlePieceShow}>
                  <i className="fas fa-expand-arrows-alt"></i>&nbsp;
                  Show Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
