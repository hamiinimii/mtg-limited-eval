function activateDefaultTab(tabname){
  $('.btn_pagename.'+tabname).click();
}


// tabs buttons
$('.btn_pagename').click(function() {
  $('.btn_pagename').each(function(i, o){
    $(o).removeClass('active');
  })
  $(this).addClass('active');

  let targetArea = $(this).attr('class').split(' ')[1];
  $('.tabmenu').each(function(i, o){
    if ($(o).hasClass(targetArea)) {
      $(o).addClass('active');
    }else{
      $(o).removeClass('active');
    }
  })
  $('.tabarea').each(function(i, o){
    if ($(o).hasClass(targetArea)) {
      $(o).addClass('active');
    }else{
      $(o).removeClass('active');
    }
  })
  styleCheck(); // なぜ縦幅がかわらんのかまったくわからん
});
