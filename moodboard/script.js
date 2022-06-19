const emoji = document.querySelectorAll('input[name="emoji"]');
const rating =document.getElementsByClassName('rating')[0];
let mood = '';
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
const icon= document.getElementById('delete');
//var heading = document.getElementsByClassName('heading1');





emoji.forEach((elem)=>{
  elem.addEventListener('click',()=>{
  matchInput(elem.id);
})
});

async function matchInput(detectedEmotion){
  header.innerHTML ='Matching';
  var r=0;
  const response = await fetch('moodboard/artemis.csv');
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
    afterMatch =true;

    while(artURL.length<50){
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
      rating.style.display = "none";
      header.innerHTML ='Click somewhere to start with your surprising moodboard';
      console.log(artURL);
      document.addEventListener('click', function(event){
        header.innerHTML ='Loading';
        event.preventDefault();
        load_pic(artURL[num],event.pageX,event.pageY);
        num+=1;
      })
    }
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
  pic.style.transform='translate(-50%,-50%) scale(0.3) rotate('+(Math.random()*20-10)+'deg)';
  pic.style.width=800 + 'px' ;
  pic.style.height=800 + 'px' ;
  pic.style.objectFit='contain'; 
  document.body.appendChild(pic);
  pic.ondrag=function(){
    pic.style.display = "none";
    icon.style.display='block';
  };
  pic.addEventListener('dragend',()=>{
    icon.style.display='none';
  });
}
