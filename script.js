const video = document.getElementById('video');
//const auth = "poaBzFoO";
let mood = '';
const matchbutton=document.querySelector('.matchbutton');
let match=false;
let query='';
let artmood='';
let moodIndex=[];
let artURL=[];
let rowNum=0;
let artname='';
let url='';
const width = 360;
const height = 280;
let header = document.getElementById('mood');
let afterMatch = false;
let num=0;
//var heading = document.getElementsByClassName('heading1');


// //loading models
// Promise.all([
//   faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
//   faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
//   faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
//   faceapi.nets.faceExpressionNet.loadFromUri('/models')
// ]).then(startVideo)

// function startVideo() {
//   navigator.getUserMedia(
//     { video: {} },
//     stream => video.srcObject = stream,
//     err => console.error(err)
//   )
// }

// //when video starts
// video.addEventListener('play', () => {

//   setInterval(async () => {
//     const detections = await faceapi.detectSingleFace(video,new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

//     if (detections && Object.keys(detections).length > 0) {
//       const expressions = detections.expressions;

//       //var arr=Object.keys(expressions).map(function(key){return expressions[key];});
//       mood = Object.keys(expressions).reduce(function(a, b){ return expressions[a] > expressions[b] ? a : b });
//     }
   

//   // Create canvas from our video element
//   const canvas = faceapi.createCanvasFromMedia(video);
//   document.body.append(canvas);
 
//   // Current size of our video
//   const displaySize = { width: video.width, height: video.height }
//   faceapi.matchDimensions(canvas, displaySize);
//   // run the code multiple times in a row --> setInterval
//   //  async func 'cause it's a async library
//   setInterval(async () => {
//       // Every 100ms, get all the faces inside of the webcam image to video element
//       const detections = await faceapi.detectAllFaces(video, 
//       new faceapi.TinyFaceDetectorOptions()).withFaceExpressions();
//       canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

//   }, 100)
// });
// });


matchbutton.addEventListener('click',()=>{
  // if (mood.length != 0){
  //   if (mood == 'neutral'){
  //     artmood='contentment';
  //   }
  //   else if (mood == 'sad'){
  //     artmood='sadness';
  //   }
  //   else if (mood == 'happy'){
  //     artmood='amusement';
  //   }
  //   else if (mood == 'fearful'){
  //     artmood='fear';
  //   }
  //   else if (mood == 'disgusted'){
  //     artmood='disgust';
  //   }
  //   else if (mood == 'angery'){
  //     artmood='anger';
  //   }
  //   else if (mood == 'surprised'){
  //     artmood='awe';
  //   };
  //   header.innerHTML ='Loading';
  //   matchInput(artmood);
  // }else{
  //   header.innerHTML ='Try again';
  // }
  matchInput('awe');
})

async function matchInput(detectedEmotion){
  header.innerHTML ='The detected emotional state is '+detectedEmotion +'. The matching art will be collected';
  var r=0;
  const response = await fetch('artemis.csv');
  const data=await response.text();
  const table=data.split('\n').slice(1);
  table.forEach(row =>{
    const col=row.split(',');
    //const arttag = col[0];
    const emotion = col[1];
    r+=1;
    if (emotion ==detectedEmotion){
      moodIndex.push(r);
    }
  }
  );


  if (moodIndex.length!=0){
    video.pause();
    video.style.display='none';
    afterMatch =true;

    while(artURL.length<30){
      var i=moodIndex[Math.floor(Math.random() * moodIndex.length)];
      if(artURL.indexOf(i) === -1) {
        var rowData= table[i+1]
        artname=rowData.split(',')[0];
        splitString=artname.split('_');
        url='https://uploads1.wikiart.org/images/'+splitString[0]+'/'+splitString[1]+'.jpg';
        if (UrlExists(url)){
          artURL.push(url);
        }  
      }
    }
    //moodboard:
    if (afterMatch==true){
      matchbutton.style.visibility = 'hidden';
      header.innerHTML ='Click somewhere to start with your surpising moodboard';
      console.log(artURL);
      document.addEventListener('click', function(event){
        header.innerHTML ='Loading';
        event.preventDefault();
        load_pic(artURL[num],event.pageX,event.pageY);
        num+=1;
      })
    }

  //   artURL.forEach(element =>{
  //     load_pic(element,500,500)
  //   })
  // }else{
  //   header.innerHTML ='Try again';
  //   console.log('loading');
  // }
  
}
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open('HEAD', url, false);
  http.send();
  if (http.status != 404 && http.status != 400){
      return true;
  }else{
      return false;
  }
}

//single pic:
async function load_pic(src,x,y) {
  const pic = document.createElement("img");
  pic.onload=header.innerHTML ='';
  pic.src = src;
  pic.style.left = x+'px';
  pic.style.top = y+"px";
  pic.style.transform='translate(-50%,-50%) scale(0.2) rotate('+(Math.random()*20-10)+'deg)';
  document.body.appendChild(pic);
}




