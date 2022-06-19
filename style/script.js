const image_input=document.querySelector('#image_input');
var uploaded_image='';
let url='https://hf.space/embed/jkang/demo-artist-classifier/+/api/predict/';
let wikiart1 ='https://www.wikiart.org/en/paintings-by-style/';
let wikiart2='?select=featured&json=2';
let format='!PinterestLarge.jpg';
const opp_images =document.querySelectorAll('.opp_img');
const simi_images =document.querySelectorAll('.simi_img');
const simi_tag =document.getElementById('tag1');
const opp_tag =document.getElementById('tag2');
const opp_sec =document.getElementById('opposite_style');
const simi_sec =document.getElementById('similar_style');
const progressBar=document.querySelector('.progress-bar');




//splitScroll();
function upload(){
    progressBar.setAttribute('id','play-animation')
}

image_input.addEventListener('change',function(){
    const reader=new FileReader();
    reader.addEventListener("load",()=>{
        uploaded_image = reader.result;
        var image=uploaded_image;
        fetch(url,{ method: "POST", body: JSON.stringify({"data":[image]}),headers: { "Content-Type": "application/json" } })
        .then(function(response) { return response.json(); })
        .then(function(json_response){ 
            const opp=translateTerm(json_response.data[1].confidences[4].label);
            const simi=translateTerm(json_response.data[1].confidences[0].label);
            getOppImage(opp);
            console.log(opp,simi);
            getSimiImage(simi);

        })
        document.querySelector('#display_image').style.backgroundImage=`url(${uploaded_image})`;
    });

    //progressBar.removeAttribute('play-animation')
    upload();

    reader.readAsDataURL(image_input.files[0]);
})

function translateTerm(label){
    if (label=='popart'){
        return 'pop-art';
    }else if (label=='fauvisme'){
        return 'pop-art';
    }else if (label=='graffitiart'){
        return 'street-art'
    }else if (label=='post_impressionism'){
        return 'post-impressionism'
    }else{
        return label;
    }
}

async function getOppImage(item){
    console.log(item);
    let wikiapi= await fetch(wikiart1+item+wikiart2);
    let json1= await wikiapi.json();
    
    //display
    opp_tag.style.display='Block';
    opp_sec.style.visibility='visible';

    //loop
    var n=0;
    var i=0;
    console.log(opp_images.length);
    while(n<opp_images.length){
      const url=json1.Paintings[i].image +format;
      if (UrlExists(url)){
        opp_images[i].src=url;
        i++;
        n++;
      }else{
          i++;
      }
    }
  }

async function getSimiImage(item){
console.log(item);
let wikiapi= await fetch(wikiart1+item+wikiart2);
let json1= await wikiapi.json();

//display
simi_tag.style.display='Block';
simi_sec.style.visibility='visible';

//loop
console.log(simi_images.length);
var n=0;
var i=0;
while(n<simi_images.length){
    const url=json1.Paintings[i].image +format;
    if (UrlExists(url)){
    simi_images[i].src=url;
      i++;
      n++;
    }else{
        i++;
    }
  }
// for (let i=0;i<40;i++){
//     const url=json1.Paintings[i].image +format;
//     simi_images[i].src=url;
//     console.log(url);
// }

}
function UrlExists(url)
{
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
}

function splitScroll(){
    console.log('scroll');

    const controller=new ScrollMagic.Controller();
    // var scene1 = new ScrollMagic.Scene({
    //     duration:'200%',
    //     triggerElement:'.opp_style',
    //     trigerHook:1
    // })
    // .setPin('.own','.similar_style')
    // .addIndicators()
    // .addTo(controller);

    var scene2 = new ScrollMagic.Scene({
        duration:'200%',
        triggerElement:'.similar_style',
        trigerHook:1
    })
    .setPin('.own','.opposite_style')
    .addIndicators()
    .addTo(controller);
}

