import React from 'react';
import Chart from 'chart.js';

class PieChart extends React.Component {

  componentDidMount = () => {

    const labels = this.props.user.instruments.map(instrument => instrument.name);
    const data = this.props.user.instruments.map(instrument => instrument.playingTime);

    const ctx = document.getElementById('pie').getContext('2d');
    let myChart = new Chart(ctx, { // eslint-disable-line
      type: 'doughnut',
      responsive: true,
      data: {
        labels: labels,
        datasets: [
          {
            fill: 'origin',
            label: 'Total Minutes Practiced',
            data: data,
            backgroundColor: [
              '#5fb3ce',
              '#f1ff77',
              '#8dff77',
              '#f200ff'
            ],
            borderColor: [
              '#ff5656',
              '#00bfff',
              '#ff77f8',
              '#7cff75'
            ],
            borderWidth: 7
          }]
      }
    });
  }

  render() {
    return <div className="chart-container" style={{ position: 'relative', height: 'auto', width: 'auto' }}>
      <canvas id="pie"></canvas>
    </div>;
  }

}

export default PieChart;
