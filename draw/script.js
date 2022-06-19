//wiki art
// Initialize the Image Classifier method with DoodleNet.
let classifier;
let request;

// A variable to hold the canvas image we want to classify
let canvas, ctx;

// Two variable to hold the label and confidence of the result
let label;
let confidence;
let button;
const width = 280;
const height = 280;

let pX = null;
let pY = null;
let x = null;
let y = null;

let mouseDown = false;

//images html
const images =document.querySelectorAll('.item_img');
const navbar =document.getElementById('navbar');
const gallery =document.getElementById('product1');

//hashtags
const elem1=document.getElementById('elem1');
const elembtns = document.querySelectorAll('.elem');

//words list
let elems=[];
let elem1url=[];
let elem2url=[];
let elem3url=[];

//quick draw
let url='https://quickdrawfiles.appspot.com/drawing/cactus?&key=AIzaSyC1_soqtXV1mTyetVpJ4GglGD5RtXuFp4o&format=JSON'

setup();
async function setup() {
  canvas = document.querySelector("#myCanvas");
  ctx = canvas.getContext("2d");

  classifier = await ml5.imageClassifier("DoodleNet", onModelReady);
  // Create a canvas with 280 x 280 px

  canvas.addEventListener("mousemove", onMouseUpdate);
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);

  // Create a clear canvas button
  button = document.querySelector("#clearBtn");

  button.addEventListener("click", clearCanvas);
  // Create 'label' and 'confidence' div to hold results
  label = document.querySelector("#label");
  confidence = document.querySelector("#confidence");

  requestAnimationFrame(draw);
}

function onModelReady() {
  console.log("ready!");
}

function clearCanvas() {
  ctx.fillStyle = "#ebedef";
  ctx.fillRect(0, 0, width, height);
  navbar.style.display = 'none';
  gallery.style.display = 'none';
}

function draw() {
  request = requestAnimationFrame(draw);

  if (pX == null || pY == null) {
    ctx.beginPath();
    ctx.fillStyle = "#ebedef";
    ctx.fillRect(0, 0, width, height);

    pX = x;
    pY = y;
  }

  // Set stroke weight to 10
  ctx.lineWidth = 10;
  // Set stroke color to black
  ctx.strokeStyle = "#000000";
  // If mouse is pressed, draw line between previous and current mouse positions
  if (mouseDown === true) {
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.moveTo(x, y);
    ctx.lineTo(pX, pY);
    ctx.stroke();
  }

  pX = x;
  pY = y;
}

function onMouseDown(e) {
  mouseDown = true;
}

function onMouseUp(e) {
  mouseDown = false;
  classifyCanvas();
}

function onMouseUpdate(e) {
  const pos = getMousePos(canvas, e);
  x = pos.x;
  y = pos.y;
}

function getMousePos(canvas, e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}

function classifyCanvas() {
  classifier.classify(canvas, gotResult);
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  defaultButtons();

  // Display error in the console
  if (error) {
    console.error(error);
  }
  // The results are in an array ordered by confidence.
  console.log(results);
  elems=[];
  let i=0;
  while(elems.length<5){
    let word=results[i].label;
    if (!word.includes('_')&word!='streetlight'){
      elems.push(word);
      changeWord(elems.length,word);
      i++;
    }
    i++;
  }
  //html
  navbar.style.display = 'Block';
  gallery.style.display = 'Block';

  //retrieve
  if(elems.length!=0){
    getImage(elems[0]);
  }
  console.log(elems);
}

async function getImage(item){
  console.log(item);
  //let wikiapi= await fetch('https://www.wikiart.org/en/api/2/PaintingSearch?term='+item+'&imageFormat=PinterestLarge&authSessionKey=595a1bec234e')
  let wikiapi= await fetch('https://www.wikiart.org/en/api/2/PaintingSearch?term='+item+'&imageFormat=PinterestLarge&origin=*')
  let json1= await wikiapi.json();
  for (let i=0;i<24;i++){
    const url=json1.data[i].image;
    load_pic(i,url);
    //console.log(url);
  }
}


function changeWord(n,word){
  if (n==1){
    elem1.innerHTML = '#'+word;
  }else if (n==2){
    elem2.innerHTML = '#'+word;
  }else if (n==3){
    elem3.innerHTML = '#'+word;
  }else if (n==4){
    elem4.innerHTML = '#'+word;
  }else if (n==5){
    elem5.innerHTML = '#'+word;
  }
}


async function load_pic(i,src) {
  images[i].src=src;
  images[i].style.width=300 + 'px' ;
  images[i].style.height=300 + 'px' ;
  images[i].style.objectFit='contain';
  };

//elembtn
document.addEventListener("DOMContentLoaded", function(){
  // console.log('DOM fully loaded and parsed');
  elembtns.forEach((elem)=>{
    elem.addEventListener('click', function(event){
      var current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace(" active", "");
      elem.classList.add('active');
      const word=elems[Number(elem.title)-1];
      for(let i=0; i<24; i++){
        images[i].src='';
      }
      getImage(word);
}) 
})
  images.forEach((img)=>{
    img.addEventListener('click', function(event){
      const maximg=img.getAttribute('src').replace('!PinterestLarge.jpg','');
      console.log(maximg);
      document.querySelector('.popup-image img').src=maximg;
      document.querySelector('.popup-image').style.display='block';
  })
  })
  document.querySelector('.popup-image span').onclick=()=>{
    document.querySelector('.popup-image').style.display='none';
  }
})

function defaultButtons(){
  var current = document.getElementsByClassName("active");
  current[0].className = current[0].className.replace(" active", "");
  elem1.classList.add('active');
}
//draw the doodles
function gotRainbow(data){
  let drawing=data.drawing;
    for(let i=0;i<path[0].length;i++){
      let x=path[0][i];
      let y=path[1][i];
    }
}
