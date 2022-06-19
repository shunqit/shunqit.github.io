const body =document.querySelector('body');
const items = document.querySelectorAll('.item');
const images =document.querySelectorAll('.item_img');
const titles =document.querySelectorAll('.item_title');
const searchbox =document.getElementById('search');
const gallery =document.getElementById('gallery');
const popup=document.getElementById('popup');
const popimages =document.querySelectorAll('.pop_img');
const loading=document.getElementById('loading');


const imageLinks=[];
let arrName=['Flowers','Animals','Rembrandt','Vermeer','Birds','Still life','Portraits','Japan','Landscape','Beautiful','Winter','Fashion','Golden Age','Amsterdam','Monsters','Paintings','Patterns','People','Nature','Women'];
let urlArr=[];

checkOrientation();
window.addEventListener('resize',()=>{
    checkOrientation();
})

document.addEventListener("DOMContentLoaded", function(){
    // console.log('DOM fully loaded and parsed');
    items.forEach((elem)=>{
        elem.addEventListener('click', function(event){
            // event.preventDefault();
            // if (event.detail===1){
            //     console.log('one');
            // }else if (event.detail===2){
            //     console.log('2');
            // }
            const relatedWord=arrName[Number(elem.title)-1];
            matchKeyword(relatedWord.toLowerCase());
            loading.style.display='block';
            setTimeout(function(){
                loading.style.display='none';
            },7000);

        });
        elem.addEventListener('dragstart',()=>{
            elem.classList.add('dragging');

        })
        elem.addEventListener('dragend',()=>{
            elem.classList.remove('dragging');  
    
        
    });
    searchbox.addEventListener('dragover',()=>{
        const chosenone=document.getElementsByClassName('dragging');
        const relatedWord=arrName[Number(chosenone[0].title)-1];
        document.getElementById('userInput').value='';
        document.getElementById("userInput").placeholder=relatedWord;
        
    })
    searchbox.addEventListener('drop',()=>{
        const chosenone=document.getElementsByClassName('dragging');
        const relatedWord=arrName[Number(chosenone[0].title)-1];
        fetch('https://api.datamuse.com/words?ml=' + relatedWord)
            .then(res=>res.json())
            .then(data=>{
            //console.log(data);
            const newArr=[];
            for (let i =0; i<=30; i++){
                if(!newArr.includes(data[i].word) && data[i].word !=relatedWord && !data[i].word.includes(' ')){
                    newArr.push(data[i].word);
                }
            }
            //generated words + keyword
            matchRelatedword(newArr,relatedWord);
            //changeText(newArr,relatedWord);
        })
        .catch(err=>console.log(err));
        })
    })
});

// get images of related words
async function matchRelatedword(arr,relatedWord){
    urlArr=[];
    const setIndex=[];
    const response = await fetch('assets/csv/keyword.csv');
    const data=await response.text();
    const keywordTable=data.split('\n');
    var n=0;
    const newArr=[];

    while (n<arr.length){
        for (i=0; i<keywordTable.length; i++){
            var setname=keywordTable[i]; //go through the whole list
            var word=arr[n] //one of the generated word
            //console.log(typeof (setname)+ ' and ' +typeof (word));
            if (setname.indexOf(word)!==-1 && setIndex.length<arr.length){
                setIndex.push(i);
                newArr.push(word);
                //console.log("n is: "+n, arr[n]+' original is: '+keywordTable[i])
                n+=1;
            }
        }
        n+=1;
    }
    for(i=0;i<newArr.length;i++){
        arrName[i]=newArr[i];
    }
    // arrName=newArr.map((element) => {
    //     return element;
    //   });
    //console.log('related words are: '+relatedWord,arrName);
    collectArt(setIndex);
    changeText(newArr,relatedWord);

}
    
// get images of the keyword
async function matchKeyword(text){
    //console.log(text);
    var r=0;
    const setIndex=[];
    const response = await fetch('assets/csv/keyword.csv');
    const data=await response.text();
    const keywordTable=data.split('\n');
    keywordTable.forEach(row =>{
        if (text ==row){
            setIndex.push(r);
        }
        r+=1;
    })
    if (setIndex.length!=0){
        collectArt2(setIndex);
        //console.log('index array is '+setIndex);
    }

}
async function collectArt2(rowArr){
    const response = await fetch('assets/csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrArt=[];
    const n=popimages.length+10;
    while(arrArt.length<n){
        const row=rowArr[Math.floor(Math.random()*rowArr.length)];
        const items=setTable[Number(row)-1].replace('\r', "").split(',');
        items.forEach(function(item){
            if(!arrArt.includes(item) && arrArt.length<n){   
                //console.log('items are '+item);            
                arrArt.push(item);
                //getImage(item);
            }
        })
    }
    if(arrArt.length==n){
        let promises=[];
        for (let i=0; i<n;i++){
            promises.push(getImage(arrArt[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            let i=0;
            let n=0;
            while (i<popimages.length){
                const url=results[n].url;
                if (UrlExists(url) && url!=undefined){
                    console.log(url,n);

                    n++;
                    changeImage2(i,url);
                    i++;
                }else{
                    n++;
                }
            }    
        })
    }   
}

function changeImage2(i,url){
    //console.log(array.url);
    popup.style.display='Block';
    popimages[i].src= url;

    // const pic = document.createElement("img");
    // pic.src = array.url;
    // pic.style.width=500 + 'px' ;
    // pic.style.height=500 + 'px' ;
    // pic.style.objectFit='contain'; 
    // popup.appendChild(pic);
}

document.querySelector('.popup-image span').onclick=()=>{
    document.querySelector('.popup-image').style.display='none';
}
document.querySelector('.instruction span').onclick=()=>{
    document.querySelector('.instruction').style.display='none';
}

async function collectArt(rowArr){
    const response = await fetch('assets/csv/userSets.csv');
    const data=await response.text();
    const setTable=data.split('\n').slice(1);
    const arrArt=[];
    const n=20;
    while(arrArt.length<n){
        const row=rowArr[Math.floor(Math.random()*rowArr.length)];
        const items=setTable[Number(row)-1].replace('\r', "").split(',');
        items.forEach(function(item){
            if(!arrArt.includes(item) && arrArt.length<n){               
                arrArt.push(item);
                //getImage(item);
            }
        })
    }
    if(arrArt.length==20){
        //console.log(arrArt); 
        let promises=[];
        for (let i=0; i<20;i++){
            promises.push(getImage(arrArt[i]));
        }  
        Promise.all(promises)
        .then((results)=>{
            //console.log(results);
            for(let i=0; i < results.length; i++){
                changeImage(i,results[i]);

                // if (UrlExists(results[i])){
                //     changeImage(results[i]);
                // }
            }    
        })
        //getImage(arrArt);
    }  

    // if(urlArr.length==20){
    //     console.log(urlArr);
    //     arrArt.forEach(function(item){
    //         changeImage(urlArr);

    //     })
    // }     
}

async function getImage(item){
    let wikiapi= await fetch('https://commons.wikimedia.org/w/api.php?action=query&list=search&srnamespace=6&srlimit=1&format=json&srsearch=' + item+' Rijksmuseum'+'&origin=*')
    let json1= await wikiapi.json();
    if(json1.query.search[0]!==undefined){
        //console.log(json1.query.search[0]);
        let title=json1.query.search[0]['title'].slice(5);
        let url='https://www.mediawiki.org/w/index.php?title=Special:Redirect/file/'+title+'&width=500&height=500';
        return{url}
    }else{
        //url='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/360px-Black_image.jpg';
        //console.log('no image found for ' + item);
        return 'error';
    }


    // try{
    //     img_url='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Black_image.jpg/360px-Black_image.jpg';
    // } catch(err){
    //     console.log('no image found for ' + item);
    // }
    // return{
    //     url
    // }
            
    }
    

//Display
function changeText(array,keyword){
    //console.log('related words are: '+keyword,array);

    for(let i=0; i < titles.length; i++){
        titles[i]= array[i];
        titles[i].innerHTML = capitalizeFirstLetter(array[i]);
    }
    //document.getElementById("userInput").setAttribute("placeholder", 'keyword');
}

function changeImage(i,array){
    //console.log(array.url);
    images[i].src= array.url;

    // for(let i=0; i < array.length; i++){
    //     images[i].src= array[i];
    //     //images[i].src='https://lh6.ggpht.com/IchmbumP9LtH9BdoAt2xG6l4yW8u01wRwzPlLmsHapDWeVJpFcPjqeDsPH0TmKD8VwEZL06WvoSycJsIKYUyTHA-0i4=s0';
    // }
}

//Support functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function checkOrientation(){
    if (window.innerWidth<window.innerHeight){
        body.classList.add('vertical');
    }else{
        body.classList.remove('vertical');
    }
}

function zoomImage(el){
    el.classList.toggle('active');
}

document.getElementById('myButton').onclick=function(){
    var userInput=document.getElementById('userInput').value;
    fetch('https://api.datamuse.com/words?ml=' + userInput)
            .then(res=>res.json())
            .then(data=>{
            //console.log(data);
            const newArr=[];
            for (let i =0; i<=30; i++){
                if(!newArr.includes(data[i].word) && data[i].word !=userInput && !data[i].word.includes(' ')){
                    newArr.push(data[i].word);
                }
            }
            matchRelatedword(newArr,userInput);
            matchKeyword(userInput.toLowerCase());
            userInput.reset();
            //changeText(newArr,relatedWord);
        })
        .catch(err=>console.log(err));
    };
        

// function UrlExists(url) {
//     var http = new XMLHttpRequest();
//     http.open('HEAD', url, false);
//     //http.send();
//     if (http.status != 404 && http.status != 400 && http.status != 429){
//         return true;
//     }else{
//         return false;
//     }
//   }

async function UrlExists(url){
     
    const res = await fetch(url);
    const buff = await res.blob();
    return buff.type.startsWith('image/')

}