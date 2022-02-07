let stats_initialized = false;
let grids = {};

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
  config['type'] = type;
  config['data'] = data;
  config['options'] = options;
  return new Chart($('#'+chart_id),config);
  // console.log(eval('window.'+chart_name));
}

function generateTable(title, counts, wrapper){
  // empty div
  // $('#'+wrapper).children('div').remove();
  // console.log(counts.length);
  // debugger;

  let columns = [...Array(counts.length)].map((_, i) => i.toString()); // [ 0, 1, 2, 3, ...]
  columns.unshift(title);
  let data = new Array(counts[0].length); // length of second dimention
  for (let i=0; i<counts.length; i++){
    data[i] = new Array(0);
    data[i].push(i);
    for (const j of counts[i]){
      data[i].push(j);
    }
  }
  // console.log(data);
  if (!stats_initialized){
    console.log("initial pattern");
    console.log($('#'+wrapper).find('div'));
    grids[wrapper] = new gridjs.Grid({
      columns: columns,
      data: data,
      // width: '50%',
      style: {
        table: {
          'font-size': '10px'
        }
      }
    }).render(document.getElementById(wrapper));
  }else{
    grids[wrapper].updateConfig({
      columns: columns,
      data: data
    }).forceRender();
  }
}

function generateChartsAndTables(){
  let mana_list = [];
  let power_list = [];
  let tough_list = [];
  let dataset_mp = [];
  let dataset_mt = [];
  let dataset_pt = [];

  $('.card_div.active').each(function(i, o){
    let mana = parseInt($(o).children('a').attr('data-c_manavalue'));
    let power = parseInt($(o).children('a').attr('data-c_power'));
    let toughness = parseInt($(o).children('a').attr('data-c_toughness'));
    if ($(o).children('[data-c_face=back]').length && !(power&&toughness)) { // transform cards and front has no PT
      power = $(o).children('[data-c_face=back]').attr('data-c_power');
      toughness = $(o).children('[data-c_face=back]').attr('data-c_toughness');
    }
    if (isNaN(power) && isNaN(toughness)){
      // console.log('not creature, skipped');
    }else{ // 0/0 is included
      // console.log('with PT ' + power + '/' + toughness);
      mana_list.push(mana);
      power_list.push(power);
      tough_list.push(toughness);
    }
  })

  if (power_list.length && tough_list.length){ // if data is not null
    const mana_range = Math.max(...mana_list)+1;
    const power_range = Math.max(...power_list)+1;
    const tough_range = Math.max(...tough_list)+1;

    // two-dimentional arrays
    let mp_counts = new Array(mana_range);
    let mt_counts = new Array(mana_range);
    let pt_counts = new Array(power_range);

    for (let i=0; i<mp_counts.length; i++){
      mp_counts[i] = [...Array(power_range)].map(() => 0);
    }
    for (let i=0; i<mt_counts.length; i++){
      mt_counts[i] = [...Array(tough_range)].map(() => 0);
    }
    for (let i=0; i<pt_counts.length; i++){
      pt_counts[i] = [...Array(tough_range)].map(() => 0);
    }

    // count pairs
    for (let i=0; i<mana_list.length; i++){
      mp_counts[mana_list[i]][power_list[i]]++;
      mt_counts[mana_list[i]][tough_list[i]]++;
      pt_counts[power_list[i]][tough_list[i]]++;
    }
    // translate to chart.js data
    for (let i=0; i<mana_range; i++){
      for (let j=0; j<power_range; j++){
        let bubble_mp = {};
        bubble_mp.x = i; // mana
        bubble_mp.y = j; // power
        bubble_mp.r = mp_counts[i][j];
        dataset_mp.push(bubble_mp);
      }
    }
    for (let i=0; i<mana_range; i++){
      for (let j=0; j<tough_range; j++){
        let bubble_mt = {};
        bubble_mt.x = i; // toughness
        bubble_mt.y = j; // power
        bubble_mt.r = mt_counts[i][j];
        dataset_mt.push(bubble_mt);
      }
    }
    for (let i=0; i<power_range; i++){
      for (let j=0; j<tough_range; j++){
        let bubble_pt = {};
        bubble_pt.x = i; // toughness
        bubble_pt.y = j; // power
        bubble_pt.r = pt_counts[i][j];
        dataset_pt.push(bubble_pt);
      }
    }
    generateTable('P-mana', mp_counts, 'table_mp');
    generateTable('T-mana', mt_counts, 'table_mt');
    generateTable('T-P', pt_counts, 'table_pt');
  }

  // chartdata
  const chartdata_mp = {
    datasets: [{
      label: 'mana/power distribution',
      data: dataset_mp,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };
  const chartdata_mt = {
    datasets: [{
      label: 'mana/toughness distribution',
      data: dataset_mt,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };
  const chartdata_pt = {
    datasets: [{
      label: 'power/toughness distribution',
      data: dataset_pt,
      backgroundColor: 'rgb(255, 99, 132)'
    }]
  };

  // prepare options
  let options_mp = JSON.parse(option_template); // option template
  options_mp.scales.x.title.text = 'mana value';
  options_mp.scales.y.title.text = 'power';
  let options_mt = JSON.parse(option_template); // option template
  options_mt.scales.x.title.text = 'mana value';
  options_mt.scales.y.title.text = 'toughness';
  let options_pt = JSON.parse(option_template); // option template
  options_pt.scales.x.title.text = 'power';
  options_pt.scales.y.title.text = 'toughness';

  // destroy all charts if exists
  if (window.ptBubbleChart){
    window.mpBubbleChart.destroy();
    window.mtBubbleChart.destroy();
    window.ptBubbleChart.destroy();
    console.log("desroyed chart");
  }
  // generate chart
  window.mpBubbleChart = generateChart('chart_mpbubble', 'bubble', chartdata_mp, options_mp);
  window.mtBubbleChart = generateChart('chart_mtbubble', 'bubble', chartdata_mt, options_mt);
  window.ptBubbleChart = generateChart('chart_ptbubble', 'bubble', chartdata_pt, options_pt);

  stats_initialized = true;
}
