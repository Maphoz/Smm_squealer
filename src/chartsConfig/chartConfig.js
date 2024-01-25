export const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 14,
        }
      },
    },
  },
  elements: {
    arc: {
      borderWidth: 2,
      borderColor: 'white',
    },
  },
  cutout: '55%', // Adjust the cutout percentage for a sharper look
};

export const pieColors = ["rgba(54, 162, 235, 0.8)", "rgba(255, 206, 86, 0.8)", "rgba(153, 102, 255, 0.8)", "rgba(75, 192, 192, 0.8)"];
const vividElectricColors = [
  "#8affff", // Blue
  "#ff7f50", // Coral
  "#e033e0", // Electric Purple
  "#7fff7f"  // Electric Green
];

export const lineOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 14
        } // Adjust font size for legend labels
      },
    },
  },
  scales: {
    x: {
      grid: {
        color: "#efefef"
      }
    },
    y: {
      grid: {
        color: "#efefef"
      }
    }
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 4,
      pointStyle: 'circle',
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
    },
  },
};