// keywords for alternative cost
const keywords_altcost = ['Cleave','Evoke','Foretell','Overload'];
// activated abilities which can be activated from hidden zone
const keywords_activated = ['Channel', 'Cycling'];

// mana buttons
$('.btn_mana').click(function() {
  const color = $(this).attr('id');
  if ($(this).hasClass('active')) { // on -> off
    console.log("turn off");
    $(this).removeClass('active');
    $(this).find('img').attr('src',"img/instant/icon_"+color+"_off.png");
  } else {
    console.log("turn on");
    $(this).addClass('active');
    $(this).find('img').attr('src',"img/instant/icon_"+color+".png");
  }
})

function findInstantAction(card) {
  let instant_action = []; // has mana value for instant actions
  let flag_instant_cast = false;
  const card_kw = card.keywords ? card.keywords : [];

  // cast
  if (card.types.includes('Instant')) {
    instant_action.push(card.manaCost+'-Instant');
    flag_instant_cast = true;
  }
  if (card_kw.includes('Flash')) { // with Flash
    instant_action.push(card.manaCost+'-Flash');
    flag_instant_cast = true;
  }
  if (flag_instant_cast) { // cast at instant timing with alternative cost
    for (let kw of keywords_altcost) {
      // console.log(kw);
      if (card_kw.includes(kw)) {
        const reg = new RegExp(kw+' (\{((([0-9]){0,2})|(([BGRUW]/){0,2}[BGPRUWX]))\})+','g');
        // console.log(reg);
        // const altcost = card.text.match(reg)[0].split(' ')[1];
        const matched = card.text.match(reg);
        for (let match of matched) {
          const altcost = card.text.match(reg)[0].split(' ')[1];
          console.log(altcost+'-'+kw);
          instant_action.push(altcost+'-'+kw);
        }
      }
    }
  }

  // activate ability from hidden zone
  for (let kw of keywords_activated) {
    if (card_kw.includes(kw)) {
      // check both kw (cost) and kw-(cost)
      const reg = new RegExp(kw+'[ —]+(\{((([0-9]){0,2})|(([BGRUW]/){0,2}[BGPRUWX]))\})+','g');
      const matched = card.text.match(reg);
      for (let match of matched) {
        const activatecost = card.text.match(reg)[0].split(' ').slice(-1)[0]; // last element of split array
        console.log(activatecost+'-'+kw);
        instant_action.push(activatecost+'-'+kw);
      }
    }

  }


  return instant_action;
}
