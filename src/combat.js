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
    } else if (enemy.damage>=1 && this.keywords.deathtouch) {
      enemy.dead = 1; // deathtouch
    }
    // return enemy.dead;
  }
}

let combatter_id = '';
let modified_param = {pow:-1, tgh:-1, keywords:{}};
const kw_dict = {
  deathtouch: "Deathtouch",
  doublestrike: "Double strike",
  firststrike: "First strike",
  indestructible: "Indestructible",
  infect: "Infect"
}

// keyword buttons
$('.btn_keyword').click(function() {
  let keyword = $(this).attr('id');
  // if (combatter.keywords[keyword]==true) { // on -> off
  if ($(this).hasClass('active')) { // on -> off
    $(this).removeClass('active');
    $(this).find('img').attr('src',"img/icon_"+keyword+"_off.png");
    modified_param.keywords[keyword] = false;
  } else { // off -> on. keyword == 0 or undefined
    $(this).addClass('active');
    $(this).find('img').attr('src', "img/icon_"+keyword+".png");
    modified_param.keywords[keyword] = true;
  }
  if (combatter_id != ''){
    // $('#'+combatter_id).appendTo("#card_combatter");
    let modi_combatter = prepareCombat(combatter_id, modified_param);
    doCombat(modi_combatter);
  }
})

$('.input_cardparam').change(function() {
  console.log($(this).val());
  modified_param[$(this).attr('id')] = parseInt($(this).val());
  let modi_combatter = prepareCombat(combatter_id, modified_param);
  doCombat(modi_combatter);
})

function prepareCombat(card_id, modifi={pow:-1, tgh:-1, keywords:{}}) {
  combatter_id = card_id;
  console.log(modifi);
  // replace card
  if ($('#card_combatter > div').length >= 2) {
    $('#card_combatter div:first-child').appendTo('#unchanged');
  }
  $('#'+card_id).attr('data-combat', 'card_combatter');
  const combatter = new Creature(); // initialize combatter
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
      // console.log(combatter);

      return false; // break;
    }
  })
  return combatter;

}

function doCombat(combatter) {
  // compare P/T
  let result = [
    ['unchanged', 'chump'],
    ['defeat', 'exchange']
  ];

  $('#unchanged, #chump, #defeat, #exchange').children('.card_div').each(function(j, p) {
    const combatted = new Creature(); // initialize combatted
    $(p).children('a').each(function(k, q) { // find a tag for card faces
      // console.log($(q).attr('data-title'));
      if ($(q).attr('data-c_types').includes('Creature')) {
        combatted.P = parseInt($(q).attr('data-c_power')); // set power
        combatted.T = parseInt($(q).attr('data-c_toughness')); // set toughness

        const that_kw = $(q).attr('data-c_keywords');
        // find c_keywords
        for (let keyword in kw_dict) {
          if (that_kw.includes(kw_dict[keyword])) combatted.keywords[keyword] = 1;
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
        $(p).appendTo('#'+result[combatted.dead][combatter.dead]);
        $(p).attr('data-combat', result[combatted.dead][combatter.dead]);

        return false; // see no more face of combatted
      }
    })
  })

}

function resetKwButtons() {
  $('.btn_keyword').each(function() {
    let keyword = $(this).attr('id');
    $(this).removeClass('active');
    $(this).find('img').attr('src',"img/icon_"+keyword+"_off.png");
    modified_param.keywords[keyword] = false;
  })
}
