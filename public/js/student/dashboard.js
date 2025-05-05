// Mock data you'd receive from your backend
const studentData = {
    name: "Hmed Hmed",
    stats: {
      highest: 19,
      lowest: 8,
      mean: 14.33 
    },
    exams: [
      { title: "Math Final", score: 19, date: "2025-03-12" },
      { title: "Science Midterm", score: 16, date: "2025-02-28" },
      { title: "English Quiz", score: 8, date: "2025-01-15" }
    ]
  };
  
  // Set student name
  document.getElementById("student-name").textContent = `Welcome, ${studentData.name}!`;
  
  // Populate the table
  const tableBody = document.getElementById("exam-table-body");
  studentData.exams.forEach((exam) => {
    const row = document.createElement("tr");
  
    row.innerHTML = `
      <td>${exam.title}</td>
      <td>${exam.score}</td>
      <td>${exam.date}</td>
    `;
  
    tableBody.appendChild(row);
  });
  
  function createCircleChart(canvasId, score, labelColor, fillColor) {
    const ctx = document.getElementById(canvasId).getContext("2d");
  
    const centerTextPlugin = {
      id: 'centerText',
      beforeDraw: function(chart) {
        const { width } = chart;
        const { height } = chart;
        const ctx = chart.ctx;
        ctx.restore();
  
        const fontSize = (height / 6).toFixed(2);
        ctx.font = `${fontSize}px Inter`;
        ctx.textBaseline = "middle";
        ctx.fillStyle = labelColor;
  
        const text = `${score}/20`;
        const textX = Math.round((width - ctx.measureText(text).width) / 2);
        const textY = height / 2;
  
        ctx.fillText(text, textX, textY);
        ctx.save();
      }
    };
  
    new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [{
          data: [score, 20 - score],
          backgroundColor: [fillColor, "#e5e7eb"],
          borderWidth: 0,
          cutout: "75%"
        }]
      },
      options: {
        plugins: {
          tooltip: { enabled: false },
          legend: { display: false }
        }
      },
      plugins: [centerTextPlugin]
    });
  }
  
  
  // Load this script first in your HTML: ChartDataLabels plugin
  // <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  
  // Then call for each:
  createCircleChart("highestChart", studentData.stats.highest, "#16a34a", "#22c55e");
  createCircleChart("lowestChart", studentData.stats.lowest, "#b91c1c", "#f87171");
  createCircleChart("meanChart", studentData.stats.mean, "#0ea5e9", "#38bdf8");
  