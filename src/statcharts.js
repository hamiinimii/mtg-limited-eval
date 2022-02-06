const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
];

const data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    // backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0, 10, 5, 2, 20, 30, 45],
    color: 'rgb(0, 99, 132)'
  }]
};

const config_template = JSON.stringify({
  // type: 'line',
  options: {
    scales: {
      x: {
        grid: {
          color: 'rgb(0,120,200)'
        }
      },
      y: {
        grid: {
          color: 'rgb(0,120,200)'
        }
      }
    },
    aspectRatio: 1
  }
});
// const myChart = new Chart(
//   document.getElementById('myChart'),
//   config
// );

function generateChart(chart_id, type, data){
  // create config from template and set data
  let config = JSON.parse(config_template);
  config['type'] = type;
  config['data'] = data;
  return new Chart($('#'+chart_id),config);
}

function generateBubbleData(){
  let power_list = [];
  let tough_list = [];
  // let pt_counts = [];
  $('.card_div').each(function(i, o){
    power = parseInt($(o).children('a').attr('data-c_power'));
    toughness = parseInt($(o).children('a').attr('data-c_toughness'));
    if ($(o).children('[data-c_face=back]').length && !(power&&toughness)) { // transform cards and front has no PT
      console.log("transform cards");
      power = $(o).children('[data-c_face=back]').attr('data-c_power');
      toughness = $(o).children('[data-c_face=back]').attr('data-c_toughness');
    }
    if (power && toughness){
      // console.log('with PT ' + power + '/' + toughness);
      power_list.push(power);
      tough_list.push(toughness);
    }else{
      // console.log('not creature, skipped');
    }
  })
  // count power-toughness sets
  let power_range = Math.max(...power_list)+1;
  let tough_range = Math.max(...tough_list)+1;
  let pt_counts = new Array(power_range);

  for (let i=0; i<pt_counts.length; i++){
    pt_counts[i] = [...Array(tough_range)].map(() => 0);
  }
  // count P/T pairs
  for (let i=0; i<power_list.length; i++){
    // console.log(power_list[i] + '/' + tough_list[i]);
    pt_counts[power_list[i]][tough_list[i]]++;
  }
  console.log(pt_counts);

  // translate to chart.js data
  let dataset = [];
  for (let i=0; i<power_range; i++){
    for (let j=0; j<tough_range; j++){
      let bubble = {};
      bubble.x = j; // toughness
      bubble.y = i; // power
      bubble.r = pt_counts[i][j];
      dataset.push(bubble);
    }
  }
  console.log(dataset);
  const chart_data = {
    datasets: [{
      label: 'First Dataset',
      data: dataset,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };
  return chart_data;

}
