var path = window.location.href;

function populateFieldsCallback(res){
    
    //$('.social-login-buttons').hide();
    var rForm = document.getElementById('register_full');
    if(!rForm) return;

    if(!rForm.name.value){
        rForm.name.value = res.firstname + ' ' + res.lastname;
        $('#register_full #name').closest('.m_field').hide();
    }

    if(!rForm.email.value && res.email != undefined){
        rForm.email.value = res.email;
        $('#register_full #email').closest('.m_field').hide();
    }

    if(res.googleID && res.googleID != undefined)
        rForm.googleID.value = res.googleID;

    if(res.facebookID && res.facebookID != undefined)
        rForm.facebookID.value = res.facebookID;

    $('#register_full #password').closest('.m_field').hide();
    $('.social-btns').hide();
    
    
    window.location.hash = '#registerform';
    //
    // remove social buttons and display message
    
}


//
// Google + signin callback. Get our user
function signinCallback(authResult) {

    //if($('#login-form').length == 0) return false;
    
    //console.log(authResult['g-oauth-window']);
    //return;

    
    if (authResult['status']['signed_in'] && authResult['g-oauth-window']) {
        /*  
        gapi.client.load('plus', 'v1', function() {
            var request = gapi.client.plus.people.get({'userId': 'me' });
            request.execute(function(resp) {
                LogIn(resp,authResult);
            });
        });*/
        //console.log(authResult);


        $.ajax({
          type: 'POST',
          url: '/site/extensions/socialLogin.php?storeToken',
          contentType: 'application/octet-stream; charset=utf-8',
          success: function(result) {
            
              //console.log(result);
              if(result.logged) window.location = "/my-account";
              
            // Handle or verify the server response if necessary.
            //if(result.action == "refresh"){
                //window.location = "/my-account";
                //window.location.reload(false);
                //console.log('refresh??');
                //return true;
           // }
              
            //if(!path.match(/\/log-in\/social/)){
                //console.log('kick to social register');
                //window.location.href = "/log-in/social";
            //}
            //populateFieldsCallback(result);
            

          },
          processData: false,
          dataType: "json",
          data: authResult['code']
        });            

    } else {
        //
        // problem
        console.log('Sign-in state: ' + authResult['error']);
        //console.log(authResult);
    }
}

function render() {
   // Additional params including the callback, the rest of the params will
   // come from the page-level configuration.


}

function LogIn(d,auth){
    //console.log(auth);
    if(auth.access_token != undefined)
        d.access_token = auth.access_token;
    if(auth.accessToken != undefined)
        d.access_token = auth.accessToken;

    $.ajax({
        url:'/site/extensions/socialLogin.php',
        type: 'POST',
        data: d,
        dataType: "json",
        success: function(res){

            //
            // forward if simple login???

            if(res != null && res.firstname != undefined){

                //populateFieldsCallback(res);
            }

            if(res.action == "refresh"){
              //location.reload(true);
                window.location.reload(false);
            }                    
        },
        complete: function() {},
        error: function(xhr, textStatus, errorThrown) 
        {
          console.log('ajax loading error...', errorThrown);
          return false;
        }
    });

}

//
// Google api inc
(function() {
  var po = document.createElement('script');
  po.type = 'text/javascript'; po.async = true;
  po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(po, s);
})();


//
// Facebook Login scripts
window.fbAsyncInit = function() {

    FB.init({
        appId      : '587245051368886',
        status     : false,
        cookie     : true, 
        xfbml      : true
    });

};

/*
var fblogin = document.getElementById('fblogin');
if(fblogin){
    fblogin.addEventListener('click',function(){
        FB.login(function(response){
            // login response
            getUser(response);
        },{ scope:'email' });
    });
}

var fbloginl = document.getElementById('fblogin_l');
if(fbloginl){
    fbloginl.addEventListener('click',function(){
        FB.login(function(response){
            // login response
            getUser(response);
        },{ scope:'email' });
    });
}
*/
//
// Lets get our user
function getUser(auth) {

    if($('#login-form').length > 0){
        FB.api('/me', function(response) {
            if(response.error){
                console.log('error ', response)   
            }else{
                LogIn(response,auth);
            }
        });
    }
}

// Load the SDK asynchronously
(function(d){
   var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
   if (d.getElementById(id)) { return;
                             }
   js = d.createElement('script'); js.id = id; js.async = true;
   js.src = "//connect.facebook.net/en_US/all.js";
   ref.parentNode.insertBefore(js, ref);
}(document));