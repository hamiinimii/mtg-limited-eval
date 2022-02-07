// let ptBubbleChart = null;

const option_template = JSON.stringify({
  // type: 'line',
  scales: {
    x: {
      grid: {
        color: 'rgb(0,120,200)'
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    },
    y: {
      grid: {
        color: 'rgb(0,120,200)'
      },
      title: {
        display: true,
        font: {
          size: 16
        }
      }
    },
  },
  aspectRatio: 1
});

// basic function for generating chart
function generateChart(chart_id, type, data, options){
  // create config from template and set data
  let config = {};
  // let config = JSON.parse(config_template); // option template
  config['type'] = type;
  config['data'] = data;
  config['options'] = options;

  return new Chart($('#'+chart_id),config);
  // console.log(eval('window.'+chart_name));
}

function generatePTBubbleChart(){
  let power_list = [];
  let tough_list = [];
  let dataset = [];
  // let pt_counts = [];
  $('.card_div.active').each(function(i, o){
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
  if (power_list.length && tough_list.length){
    // count power-toughness sets
    if (power_list && tough_list){
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
      // translate to chart.js data
      for (let i=0; i<power_range; i++){
        for (let j=0; j<tough_range; j++){
          let bubble = {};
          bubble.x = j; // toughness
          bubble.y = i; // power
          bubble.r = pt_counts[i][j];
          dataset.push(bubble);
        }
      }
    }
  }


  // console.log(dataset);
  const chart_data = {
    datasets: [{
      label: 'PT distribution',
      data: dataset,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };

  // prepare options
  let options = JSON.parse(option_template); // option template
  // options[xAxes][scaleLabel] = {labelString: 'toughness'};
  options.scales.x.title.text = 'toughness';
  options.scales.y.title.text = 'power';
  console.log(options.scales);

  if (window.ptBubbleChart){
    window.ptBubbleChart.destroy();
    console.log("desroyed chart");
  }
  // generate chart
  window.ptBubbleChart = generateChart('chart_ptbubble', 'bubble', chart_data, options);

}
