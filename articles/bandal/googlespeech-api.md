구글 stt 사용법
------

[아웃풋텍스트], [인풋pcm], [GOOGLE-API-key] 를 아래 protocol에 포함시켜서 curl로 날리면 된다.

curl -X POST -o [아웃풋텍스트] --data-binary @[인풋pcm] --header 'Content-Type: audio/l16; rate= 16000;' 'https://www.google.com/speech-api/v2/recognize?output=json&lang=ko-kr&key=[GOOGLE-API-KEY]'
