class Creature {
  constructor() {
    this.P = 0;
    this.T = 0;
    this.keywords = {};
    this.damage = 0;
    this.gets = [+0,+0]; // gets +X/+X
    this.dead = 0;
  }

  dealDamage(enemy) { // enemy is Creature object
    if (this.keywords.infect) {
      enemy.gets[0] -= (this.P + this.gets[0]);
      enemy.gets[1] -= (this.P + this.gets[0]);
    } else {
      enemy.damage += (this.P + this.gets[0]);
    }
    // check whether enemy died
    if (enemy.T+enemy.gets[1]<=0) {
      enemy.dead = 1; // enemy toughness <= 0
    } else if (enemy.T+enemy.gets[1]-enemy.damage<=0 && !enemy.keywords.indestructible) {
      enemy.dead = 1; // enemy was dealt damage greater than its tougness
    } else if (enemy.damage>=1 && this.keywords.deathtouch && !enemy.keywords.indestructible) {
      enemy.dead = 1; // deathtouch
    }
  }
}

let combatter_id = '';
let modified_param = {pow:-1, tgh:-1, keywords:{}};
const kw_dict = {
  deathtouch: "Deathtouch",
  doublestrike: "Double strike",
  firststrike: "First strike",
  flying: "Flying",
  indestructible: "Indestructible",
  infect: "Infect",
  reach: "Reach"
}

// keyword buttons
$('.btn_keyword').click(function() {
  const keyword = $(this).attr('id');
  if ($(this).hasClass('active')) { // on -> off
    $(this).removeClass('active');
    $(this).find('img').attr('src',"img/combat/icon_"+keyword+"_off.png");
    modified_param.keywords[keyword] = false;
  } else { // off -> on. keyword == false or undefined
    $(this).addClass('active');
    $(this).find('img').attr('src', "img/combat/icon_"+keyword+".png");
    modified_param.keywords[keyword] = true;
  }
  if (combatter_id != ''){
    let modi_combatter = prepareCombat(combatter_id, modified_param);
    doCombat(modi_combatter);
  }
})

// switch attack and block
$('.btn_attackblock').click(function() {
  if ($(this).hasClass('attack')) {
    $(this).removeClass('attack');
    $(this).html('<img src="img/combat/icon_block.png" height ="25" width="25" alt="">Block');
  } else {
    $(this).addClass('attack');
    $(this).html('<img src="img/combat/icon_attack.png" height ="25" width="25" alt="">Attack')
  }
  if (combatter_id != ''){
    let modi_combatter = prepareCombat(combatter_id, modified_param);
    doCombat(modi_combatter);
  }
})

// modify combat
$('.input_cardparam').change(function() {
  modified_param[$(this).attr('id')] = parseInt($(this).val());
  let modi_combatter = prepareCombat(combatter_id, modified_param);
  doCombat(modi_combatter);
})

// close combatter
$('.btn_closecombatter').click(function() {
  if (combatter_id != '') {
    $('#'+combatter_id).appendTo('#unchanged');
    combatter_id = "";
    resetKwAndPT();
    resetCombatCards();
  }
  $(this).find('img').attr('src', "img/combat/icon_close_off.png");
  updateCounts();
})

function prepareCombat(card_id, modifi={pow:-1, tgh:-1, keywords:{}}) {
  combatter_id = card_id;
  // replace card
  if ($('#card_combatter > div').length >= 2) {
    $('#card_combatter div:first-child').appendTo('#unchanged');
  }
  $('#'+card_id).attr('data-combat', 'card_combatter');
  const combatter = new Creature(); // initialize combatter
  // enable close button
  $('.btn_closecombatter').find('img').attr('src', "img/combat/icon_close.png");

  // Find creature face. First found is used.
  $('#'+card_id).children('a').each(function(i, o){ // fetch target card data
    if ($(o).attr('data-c_types').includes('Creature')) {
      if (modifi.pow < 0) {
        combatter.P = parseInt($(o).attr('data-c_power'));
        modified_param.pow = parseInt($(o).attr('data-c_power'));
        $('#pow').val(modified_param.pow);
      } else {
        combatter.P = modifi.pow;
      }
      if (modifi.tgh < 0) {
        combatter.T = parseInt($(o).attr('data-c_toughness'));
        modified_param.tgh = parseInt($(o).attr('data-c_toughness'));
        $('#tgh').val(modified_param.tgh);
      } else {
        combatter.T = modifi.tgh;
      }

      const this_kw = $(o).attr('data-c_keywords');
      // find c_keywords
      for (let keyword in kw_dict) {
        if (keyword in modifi.keywords) { // modified keywords on UI is prioritized to card text
          combatter.keywords[keyword] = modifi.keywords[keyword];
        } else if (this_kw.includes(kw_dict[keyword])) {
          combatter.keywords[keyword] = true;
          $('#'+keyword).trigger('click');
        }
      }
      return false; // break;
    }
  })
  return combatter;
}

// consts for doCombat
const result_id = [
  ['unchanged', 'chump'],
  ['defeat', 'exchange']
];
const result_text = {
  unchanged: $('#text_unchanged').text(),
  chump:     $('#text_chump').text(),
  defeat:    $('#text_defeat').text(),
  exchange:  $('#text_exchange').text()
};

function doCombat(combatter) {
  // compare P/T
  $('#unchanged, #chump, #defeat, #exchange').children('.card_div').each(function(j, p) {
    const combatted = new Creature(); // initialize combatted
    $(p).children('a').each(function(k, q) { // find a tag for card faces
      if ($(q).attr('data-c_types').includes('Creature')) {
        combatted.P = parseInt($(q).attr('data-c_power')); // set power
        combatted.T = parseInt($(q).attr('data-c_toughness')); // set toughness

        const that_kw = $(q).attr('data-c_keywords');
        // find c_keywords
        for (let keyword in kw_dict) {
          if (that_kw.includes(kw_dict[keyword])) combatted.keywords[keyword] = true;
        }
        // flier cannot be blocked except for by fliers or reachers
        if (($('.btn_attackblock').hasClass('attack') && combatter.keywords.flying && !(combatted.keywords.flying || combatted.keywords.reach)) // attacking and flying
         || !($('.btn_attackblock').hasClass('attack')) && !(combatter.keywords.flying || combatter.keywords.reach) && combatted.keywords.flying) { // blocking and enemy is flying
          $(p).appendTo('#unchanged');
          $(p).attr('data-combat', 'unchanged');
          return false;
        }
        // reset combatter state
        combatter.damage = 0;
        combatter.gets = [0, 0];
        combatter.dead = 0;

        // first damage step
        if (combatter.keywords.firststrike || combatter.keywords.doublestrike) combatter.dealDamage(combatted);
        if (combatted.keywords.firststrike || combatted.keywords.doublestrike) combatted.dealDamage(combatter);

        // second damage step
        if (!combatter.dead && !combatted.dead) { // if combat did not end at first damage step
          if (!combatter.keywords.firststrike) combatter.dealDamage(combatted);
          if (!combatted.keywords.firststrike) combatted.dealDamage(combatter);
        }
        // move card to the result area
        $(p).appendTo('#'+result_id[combatted.dead][combatter.dead]);
        $(p).attr('data-combat', result_id[combatted.dead][combatter.dead]);

        return false; // see no more face of combatted
      }
    })
  })

  // count numbers
  updateCounts();
}

function resetKwAndPT() {
  $('.btn_keyword').each(function() {
    let keyword = $(this).attr('id');
    $(this).removeClass('active');
    $(this).find('img').attr('src',"img/combat/icon_"+keyword+"_off.png");
    modified_param.keywords[keyword] = false;
  })
  $('#pow').val('0');
  $('#tgh').val('0');
}

function resetCombatCards() {
  $('.card_div').each(function(i, o){
    $(o).children('a').each(function(j, q){
      if ($(q).attr('data-c_types').includes('Creature')) $(o).appendTo('#unchanged');
    })
  })
}

function updateCounts() {
  // count numbers
  for (let key in result_text) {
    let count = $('#'+key+' .card_div').length >= 1 ? ": "+$('#'+key+' .card_div.active').length : ''
    $('#text_'+key).text(result_text[key] + count);
  }
}
