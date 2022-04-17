function doCombat(card_elm) {
  // replace card
  if ($('#card_combatter > div').length >= 1) {
    $('#card_combatter div:first-child').appendTo('#cards_uncombat');
  }


}
