
var form = $('.form');
var btn = $('#submit');
var topbar = $('.topbar');
var passBlock = $('#password');
var userBlock = $('#username');
var article =$('.article');
var tries = 0;
var h = passBlock.height();
$('.spanColor').height(h+23);
$('#findpass').on('click',function(){
  $(this).text('this-is-soo-cool');
});
passBlock.on('focus',function(){
  topbar.removeClass('error success');
  passBlock.text('');
});
btn.on('click',function(){
  if(tries<=2){
    var pass = $('#password').val();
    console.log(pass);
    if(pass==='test'){
    setTimeout(function(){
      btn.text('Success!');
    },250);
    topbar.addClass('success');
    form.addClass('goAway');
    article.addClass('active');
    tries=0;
  }
    else{
      topbar.addClass('error');
      tries++;
      switch(tries){
        case 0:
          btn.text('Login');
          break;
        case 1:
          setTimeout(function(){
          btn.text('You have 2 tries left');
          },300);
          break;
        case 2:
          setTimeout(function(){
          btn.text('Only 1 more');
          },300);
          break;
        case 3:
          setTimeout(function(){
          btn.text('Get Passcode to Enter');
          },300);
          passBlock.prop('disabled',true);
          topbar.removeClass('error');
          passBlock.addClass('disabled');
		  userBlock.prop('disabled',true);
		  userBlock.addClass('disabled');
          btn.addClass('recover');
          break;
         defaut:
          btn.text('Login');
          break;
      }
    } 
  }
  else{
    topbar.addClass('disabled');
  }
  
});

$('.form').keypress(function(e){
   if(e.keyCode==13)
   submit.click();
});
passBlock.keypress(function(){
  topbar.removeClass('success error');
});