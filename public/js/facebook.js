  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // response 객체는 현재 로그인 상태를 나타내는 정보를 보여준다. 
    // 앱에서 현재의 로그인 상태에 따라 동작하면 된다.
    // FB.getLoginStatus().의 레퍼런스에서 더 자세한 내용이 참조 가능하다.
    if (response.status === 'connected') {
      // 페이스북을 통해서 로그인이 되어있다.
      testAPI();
    } else if (response.status === 'not_authorized') {
      // 페이스북에는 로그인 했으나, 앱에는 로그인이 되어있지 않다.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // 페이스북에 로그인이 되어있지 않다. 따라서, 앱에 로그인이 되어있는지 여부가 불확>실하다.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }   
  }
 
  // 이 함수는 누군가가 로그인 버튼에 대한 처리가 끝났을 때 호출된다.
  // onlogin 핸들러를 아래와 같이 첨부하면 된다.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
	  console.log("onlogin button");
      statusChangeCallback(response);
    }); 
  }
 
  window.fbAsyncInit = function() {
  FB.init({
    appId      : '860143334031818',
    cookie     : true,  // 쿠키가 세션을 참조할 수 있도록 허용
    xfbml      : true,  // 소셜 플러그인이 있으면 처리
    version    : 'v2.1' // 버전 2.1 사용
  }); 

  // 그 3가지 상태는 아래와 같다.
  // 1. 앱과 페이스북에 로그인 되어있다. ('connected')
  // 2. 페이스북에 로그인되어있으나, 앱에는 로그인이 되어있지 않다. ('not_authorized')
  // 3. 페이스북에 로그인이 되어있지 않아서 앱에 로그인이 되었는지 불확실하다.
  //  
  // 위에서 구현한 콜백 함수는 이 3가지를 다루도록 되어있다.
  };  
  
    // SDK를 비동기적으로 호출
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));

  // 로그인이 성공한 다음에는 간단한 그래프API를 호출한다.
  // 이 호출은 statusChangeCallback()에서 이루어진다.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
        $.ajax({
        url:'/fb',
        type:'post',
        data:{'user_id':response.id},
		success:function(data){
				//alert(data);
			}
		});
    });
  }

  
