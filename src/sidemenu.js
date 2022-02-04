// toggle menu
$('.btn_menu').click(function(){
  // $('.side').stop(true).animate({'width': 'toggle'});
  console.log("menu btn clicked");
  $(this).toggleClass('active');
  $(".side_menu").toggleClass('panelactive');
});
// check all
$('.btn_check').on('click', () => {
  $('.checkall').each(function(i, o){
    // console.log(o);
    $(o).attr('checked', true).prop('checked', true).change();
  })
});
// uncheck all
$('.btn_uncheck').on('click', () => {
  $('.checkall').each(function(i, o){
    $(o).removeAttr('checked').prop('checked', false).change();
  })
});
// uncheck area
$('.checkall').change(function() {
  let isChecked = $(this).prop('checked');
  let filter = '.' + $(this).attr('class').split(' ')[1];
  $('.check'+ filter).each(function(i, o){
    // console.log(o);
    $(o).removeAttr('checked').prop('checked', isChecked).change();
  })
});

// trigger color filtering
 $('.check').change(filterChange);
 $('.check').change(styleCheck);

 // color filtering function
 function filterChange(){
   let visible = [];
   // data variables
   let color = '';
   let rarity = '';
   let types = '';
   let types_front = [];
   let types_back = [];

   $('.card_div').each(function(i, o){
     color = $(o).children('a').attr('data-c_color').replace(/,/g, '');
     rarity = $(o).children('a').attr('data-c_rarity');
     visible = [false, false, true]; // initialize visibility
     // check color
     if ($('.color-multi').prop("checked")==true){
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==true){
           visible[0] = true;
           break;
         }
       }
     }else{ // not showing multicolored unless all colors are included
       visible[0] = true;
       for (let i = 0; i < color.length; i++){
         if ($('.'+color[i]).prop('checked')==false){
           visible[0] = false;
           break;
         }
       }
     }
     // check types
     types_front = $(o).children('[data-c_face=front]').attr('data-c_types').split(',');
     if ($(o).children('[data-c_face=back]').length && $('.type-multi').prop('checked')==true) { // transform cards
       types_back = $(o).children('[data-c_face=back]').attr('data-c_types').split(',');
       Array.prototype.push.apply(types_front, types_back);
     }
     for (let i = 0; i < types_front.length; i++){
       if ($('.'+types_front[i]).prop('checked')==true){
         visible[1] = true; // by default visible[1] is false and only in this case it becomes true
         break;
       }
     }
     // check rarity
     visible[2] = $('.'+rarity).prop('checked');

     // if variation card, hide it
     visible[3] = !($(o).hasClass('variation'));

     // result
     if (visible.every(value => value==true)){
       $(o).show();
     } else {
       $(o).hide();
     }
   })

 }

 function styleCheck(){
   // remove Untiered if no cards left anymore
   console.log($('#cards_untiered').find('.card_div').length);
   if ($('#cards_untiered').find('.card_div').length==0){
     $('#area_untiered').hide();
   }
   // adjust bg height to scroll or window
   scrollPx = $('#wrapper').height() + 'px';
   $('.bg').css('height','max('+scrollPx+',100vh');
 }
