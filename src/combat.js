let kw_manager = {
  deathtouch: 0,
  doublestrike: 0,
  firststrike: 0,
  indestructible: 0,
  infect: 0
}

// keyword buttons
$('.btn_keyword').click(function() {
  let keyword = $(this).attr('id');
  if (kw_manager[keyword]==0) { // off -> on
    kw_manager[keyword] = 1;
    $(this).addClass('active');
    $(this).find('img').attr('src',"img/icon_"+keyword+".png");
  } else { // on -> of
    kw_manager[keyword] = 0;
    $(this).removeClass('active');
    $(this).find('img').attr('src', "img/icon_"+keyword+"_off.png");
  }
})



function doCombat(card_id) {
  card_id = '#'+card_id;
  // replace card
  if ($('#card_combatter > div').length >= 2) {
    $('#card_combatter div:first-child').appendTo('#unchanged');
  }
  // 破壊不能
  // 感染
  // プロテクション
  // 接死

  // compare P/T
  let this_combat = [0, 0, 0]; // power, toughness, strike (0, 1st strike, double(2) strike)
  let that_combat = [0, 0, 0];
  let this_def_tough = 0;
  let flag_kill = 0;
  let flag_death = 0;
  let result = [
    ['#unchanged', '#chump'],
    ['#defeat', '#exchange']
  ];

  $('#card_combatter div:first-child').children('a').each(function(i, o){ // fetch target card data
    if ($(o).attr('data-c_types').includes('Creature')) {
      this_combat[0] = parseInt($(o).attr('data-c_power'));
      this_combat[1] = parseInt($(o).attr('data-c_toughness'));
      this_def_tough = parseInt($(o).attr('data-c_toughness'));

      if ($(o).attr('data-c_keywords').includes('First strike')){
        this_combat[2] = 1;
      } else if ($(o).attr('data-c_keywords').includes('Double strike')){
        this_combat[2] = 2;
        console.log("this double strike");
      } else {
        this_combat[2] = 0;
      }
      console.log('this_combat='+this_combat);
      return false; // break;
    }
  })

  $('#unchanged').children('.card_div').each(function(i, o) {
    // initialize flags and toughness
    flag_kill = 0;
    flag_death = 0;
    this_combat[1] = this_def_tough;

    $(o).children('a').each(function(j, q) { // find a tag for card faces
      console.log($(q).attr('data-title'));
      if ($(q).attr('data-c_types').includes('Creature')) {
        that_combat[0] = parseInt($(q).attr('data-c_power')); // set power
        that_combat[1] = parseInt($(q).attr('data-c_toughness')); // set toughness
        if ($(q).attr('data-c_keywords').includes('First strike')){
          that_combat[2] = 1;
        } else if ($(q).attr('data-c_keywords').includes('Double strike')){
          that_combat[2] = 2;
          console.log("that double strike");
        } else {
          that_combat[2] = 0;
        }
        console.log("that pt = "+that_combat);
        // first damage step
        if (this_combat[2]>=1){
          that_combat[1] -= this_combat[0]; // deal damage to toughness
          // console.log("that combat tough = " + that_combat[1]);
          flag_kill = (that_combat[1]<=0) ? 1 : 0;
        }
        if (that_combat[2]>=1){
          this_combat[1] -= that_combat[0]; // deal damage to toughness
          flag_death = (this_combat[1]<=0) ? 1 : 0;
        }
        console.log("first combat, kill="+flag_kill +", death="+flag_death);
        // second damage step
        if (!flag_kill && !flag_death) { // if combat did not end at first damage step
          console.log("second damage step");
          if (this_combat[2]!=1){ // not first strike
            that_combat[1] -= this_combat[0]; // deal damage to toughness
            console.log("result, that toughness="+that_combat[1]);
            flag_kill = (that_combat[1]<=0) ? 1 : 0;
          }
          if (that_combat[2]!=1){ // not first strike
            this_combat[1] -= that_combat[0]; // deal damage to toughness
            console.log("result, this toughness="+this_combat[1]);
            flag_death = (this_combat[1]<=0) ? 1 : 0;
          }
        }
        return false; // see no more face
      }
    })
    // move card to the result area
    console.log("kill="+flag_kill +", death="+flag_death);
    $(o).appendTo(result[flag_kill][flag_death]);
  })


}
