function activateDefaultTab(tabname){
  $('.btn_pagename.'+tabname).click();
}

// tabs buttons
$('.btn_pagename').click(function() {
  $('.btn_pagename').each(function(i, o){
    $(o).removeClass('active');
  })
  $(this).addClass('active');

  const target_area = $(this).attr('class').split(' ')[1];

  $('.tabarea').each(function(i, o){
    if ($(o).hasClass(target_area)) {
      $(o).addClass('active');
    }else{
      $(o).removeClass('active');
    }
  })

  if (current_tab!=target_area) { // run only if other tab than current is selected
    current_tab=target_area;
    // move cards to activated tabarea
    $('.card_div').each(function(i, o){
      if (target_area=='tiers') {
        const this_tier = '#cards_tier' + $(o).attr('data-tier');
        // console.log(this_tier);
        $(o).appendTo(this_tier);
      } else if (target_area=='combat') {
        $(o).appendTo('#cards_uncombat');
      }
    })

    styleCheck(); // なぜ縦幅がかわらんのかまったくわからん
  }
});


// setname input
$('input#setname').focusin(function(){
  $(this).addClass('inactive');
});

$('input#setname').focusout(function(){
  inputEnd();
});