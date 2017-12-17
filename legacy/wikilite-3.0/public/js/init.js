
//네비게이션바 액티브
$('.button-collapse').sideNav();

//cp_Url 페이지 글 url 복사하기 
function cp_Url(url) {
  var IE = (document.all) ? true:false;
  if (IE) {
    if(confirm("이 피드의 주소를 복사하시겠습니까?"))
      window.clipboardData.setData("Text", url);
  } else {
    temp = prompt("이 피드의 주소입니다. Ctrl+C를 눌러 복사하세요", url);
  }
}
