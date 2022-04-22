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
    }
    // return enemy.dead;
  }
}

let combatter_id = '';
let modified_kw = {};
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
    modified_kw[keyword] = false;
  } else { // off -> on. keyword == 0 or undefined
    $(this).addClass('active');
    $(this).find('img').attr('src', "img/icon_"+keyword+".png");
    modified_kw[keyword] = true;
  }
  if (combatter_id!=''){
    let modi_combatter = prepareCombat(combatter_id, modified_kw);
    doCombat(modi_combatter);
  }
})

function prepareCombat(card_id, modified_keywords={}) {
  combatter_id = card_id;
  // replace card
  if ($('#card_combatter > div').length >= 2) {
    $('#card_combatter div:first-child').appendTo('#unchanged');
  }
  const combatter = new Creature(); // initialize combatter
  // Find creature face. First found is used.
  $('#'+card_id).children('a').each(function(i, o){ // fetch target card data
    if ($(o).attr('data-c_types').includes('Creature')) {
      combatter.P = parseInt($(o).attr('data-c_power'));
      combatter.T = parseInt($(o).attr('data-c_toughness'));

      const this_kw = $(o).attr('data-c_keywords');
      // find c_keywords
      for (let keyword in kw_dict) {
        if (keyword in modified_keywords) { // modified keywords on UI is prioritized to card text
          combatter.keywords[keyword] = modified_keywords[keyword];
        } else if (this_kw.includes(kw_dict[keyword])) {
          combatter.keywords[keyword] = true;
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
    ['#unchanged', '#chump'],
    ['#defeat', '#exchange']
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
        $(p).appendTo(result[combatted.dead][combatter.dead]);

        return false; // see no more face of combatted
      }
    })
  })

}
