import React from 'react';
import moment from 'moment';
import Chart from 'chart.js';

class LineGraph extends React.Component {

  state = {
    daysDisplayed: null,
    mode: 'all-time'
  }

  componentDidMount = () => {
    this.setState({ ...this.state, daysDisplayed: this.handleAllTimeDates()});
  }

  componentDidUpdate = () => {
    const labels = [];
    for (var i = (this.state.daysDisplayed - 1); i >= 0; i--) {
      labels.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }

    const data = labels.map(date => {
      if (this.props.user.practiceLog && Object.keys(this.props.user.practiceLog).includes(date)) {
        return this.props.user.practiceLog[date];
      } else {
        return 0;
      }
    });

    const ctx = document.getElementById('line').getContext('2d');
    let myChart = new Chart(ctx, { // eslint-disable-line
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            fill: 'origin',
            label: 'Total Minutes Practiced',
            data: data,
            backgroundColor: [
              '#5fb3ce'
            ],
            borderColor: [
              '#ff5656'
            ],
            borderWidth: 7
          }]
      },
      options: {
        scales: {
          yAxes: [{
            stacked: true,
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  handleGraphDates = ({ target: { value, name }}) => {
    this.setState({ ...this.state, daysDisplayed: value, mode: name });
  }

  handleAllTimeDates = () => {
    const a = moment(this.props.user.accountCreated);
    const b = moment();
    return Math.abs(a.diff(b, 'days')) + 1;
  }

  handleDisplayMode = (mode) => {
    const modes = {
      'all-time': 'All Time',
      '7-days': 'Last 7 days',
      '30-days': 'Last 30 days'
    };
    return modes[mode];
  }

  render() {
    return <div>
      <h2>Your Practice Progress ({this.handleDisplayMode(this.state.mode)})</h2>
      <button
        className="button is-primary"
        onClick={this.handleGraphDates}
        value={this.handleAllTimeDates()}
        name="all-time"
        disabled={this.state.mode === 'all-time'}
      >
        Show all time
      </button>
      &nbsp;
      <button
        className="button is-primary"
        onClick={this.handleGraphDates}
        value={7}
        name="7-days"
        disabled={this.state.mode === '7-days'}
      >
        Show last 7 days
      </button>
      &nbsp;
      <button
        className="button is-primary"
        onClick={this.handleGraphDates}
        value={30}
        name="30-days"
        disabled={this.state.mode === '30-days'}
      >
        Show last 30 days
      </button>
      { this.state.daysDisplayed && <div className="chart-container">
        <canvas id="line"></canvas>
      </div> }
    </div>;
  }

}

export default LineGraph;
