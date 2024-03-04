import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartProps {
  chartdata: {
    labels: any;
    data: {
      label: any;
      data: any;
      fill: any;
      borderColor: any;
      tension: any;
    }[];
  };
}

const LineChart: React.FC<ChartProps> = ({ chartdata }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: chartdata.labels,
          datasets: chartdata.data
        },
        options: {
          scales: {
            y: {
              position: 'right',
              // beginAtZero: true,
              ticks: {
                stepSize: 5 // Adjust stepSize as needed
              }
            }
          },
          plugins: {
            legend: {
              display: false // Hide legend
            },
          }
        }
      });

      return () => {
        myChart.destroy();
      };
    }
  }, [chartdata]);

  return <canvas ref={chartRef} />;
};

export default LineChart;

