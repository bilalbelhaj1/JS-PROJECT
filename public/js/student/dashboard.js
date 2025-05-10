// Mock data you'd receive from your backend
let studentData;
 fetch('/student/home',{
   method:'POST',
   headers:{
    'Content-Type':'Application/json',
   },
   body: JSON.stringify({})
 })
     .then(async response=>{
       if(response.ok){
          studentData = await response.json();
          displayData(studentData);
       }
     })
  // Populate the table
  function displayData(studentData){
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
  
        const text = `${score}/100`;
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
          data: [score, 100 - score],
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
  
  

  createCircleChart("highestChart", studentData.stats.highest, "#16a34a", "#22c55e");
  createCircleChart("lowestChart", studentData.stats.lowest, "#b91c1c", "#f87171");
  createCircleChart("meanChart", studentData.stats.mean, "#0ea5e9", "#38bdf8");
  
  }