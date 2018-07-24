
  function chartJs(){
  var dData = function() {
    //return Math.round(Math.random() * 90) + 10
  };

  var barChartData = {
    labels: ["최운호", "이수봉", "심상현", "박성민", "안재일", "서상필", "조현성", "김영민", "정우석", "조일환"],
    datasets: [{
      fillColor: "rgba(0,60,100,1)",
      strokeColor: "black",
      data: [257000, 257000, 400000, 257000, 400000, 257000, 400000, 257000, 257000, 257000]
    }]
  }

  var index = 11;
  var ctx = document.getElementById("chars").getContext("2d");
  var barChartDemo = new Chart(ctx).Bar(barChartData, {
    responsive: true,
    barValueSpacing: 2
  });
  // setInterval(function() {
  //   barChartDemo.removeData();
  //   barChartDemo.addData([400000], "dD " + index);
  //   index++;
  // }, 3000);
  }