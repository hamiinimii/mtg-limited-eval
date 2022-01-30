// toggle menu
$('.btn_menu').on('click', () => {
  // side.classList.toggle('open-menu')
  $('.side').stop(true).animate({'width': 'toggle'});
});

// trigger color filtering
 $('input:checkbox.colorcheck').change(colorchange);


 // color filtering function
 function colorchange(){
   $('.card_div').each(function(i, o){
     // let color = $(o).children('a').attr('data-c_color');
     let color = $(o).children('a').attr('data-c_color').replace(/,/g, '');
     console.log(color);
     let visible = false;
     for (let i = 0; i < color.length; i++){
       // console.log($('.'+color[i]).prop('checked'));
       // if ($('colorcheck' + color[i]).prop('checked')!=false){
       if ($('.'+color[i]).prop('checked')==true){
         $(o).show();
         visible = true;
         break;
       }
     }
     if (!visible){
       $(o).hide();
     }
     // console.log(o.attr('data-c_color'));
   })
   console.log("color change!");
 }
