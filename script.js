let bookmarked = false;
let numberOfPostsForUser = 7;
let comm = [];
let mcomm = [];
let DefaultCommentsofPost = 3;
let followedUsers = 0;
let numberOfUsers = 20;
let mode = "nice";
let notliked = '';
let user =[];
let lastActive = 0;
let overlayShown = false;
load();


//////////////////////////////////////////////// generating random user //////////////////////

function start(){
    if (user.length === 0) {        
    } else {
       document.getElementById('findpeople').style.display = "none";
       document.getElementById('findnewpeople').innerHTML = `Leute wechseln`;
       renderSuggestions();
       renderFollowed(); 
       renderPosts(lastActive);
    }
}


function generateFakeUser(){     
        for (let i = 0; i < numberOfUsers; i++) {
        generateProfilePic();
        generate(firstNames, 'firstname');
        generate(lastNames, 'lastname')
        generate(locations, 'location')
        generatePosts();
        user.push(randomuser[0]);
        randomuser = [{"firstname": "X", "lastname": "X", "location": "X", "profilepic": "X", 
        "posts": [], "followed": false, "active": false}];
        }
        document.getElementById('findpeople').style.display = "none";
        document.getElementById('findnewpeople').innerHTML = `Leute wechseln`;
        renderSuggestions();
        save();

}   


function generatePosts(){
        for (let i = 0; i < numberOfPostsForUser; i++) {
            let random = Math.floor((Math.random()) * 64);
            let randomlikes = Math.floor((Math.random()) * 1000); 
            let posts = [{"pic": random, "numberoflikes": randomlikes, "nicecomments": [], "meancomments": [], "liked": false, 
            "bookmarked": false}]
            for (let index = 0; index < DefaultCommentsofPost; index++) {
                let random2 = Math.floor((Math.random()) * niceComments.length);
                comm.push(niceComments[random2])
            }
            posts[0]['nicecomments'].push(comm);
            for (let index = 0; index < DefaultCommentsofPost; index++) {
                let random2 = Math.floor((Math.random()) * meanComments.length);
                mcomm.push(meanComments[random2])
            }
            posts[0]['meancomments'].push(mcomm);
            mcomm = [];
            comm = [];
            randomuser[0]['posts'].push(posts);
        }
}   


function generateProfilePic(){
    let random = Math.floor((Math.random()) * 50);
    randomuser[0].profilepic = `img/faces/profilepic${random}.jpg`;
}


function generate(nameOfArray, nameOfPosition){
    let random = Math.floor((Math.random()) * nameOfArray.length);
    randomuser[0][`${nameOfPosition}`] = nameOfArray[random];
}


function newUser(){
    user = [];
    followedUsers = 0;
    lastActive = 0;
    save();
    document.getElementById('posts-container').innerHTML = ``;
    document.getElementById('sugg-box').innerHTML = ``;
    document.getElementById('follower-box').innerHTML = ` 
    <p class="sugg-card-newpeople">Du folgst noch niemandem</p>`;
    generateFakeUser();
}


///////////////////////////////////////////////// dark mode /////////////////////////////////////

function switchMode(){
    if (mode === "nice") {
        mode = 'mean';
        notliked = "nicht";
        darkMode();
    } else {
        mode = "nice"
        notliked = '';
        lightMode();
    }
}


function changeIcons(id, filename, lightordark){
    let icon = document.getElementById(`header-${id}`);
    icon.src = `icon/${lightordark}${filename}`;
}


function changeHeaderIcons(lightordark){
    changeIcons('home', 'homepage-icon.png', lightordark);
    changeIcons('plane', 'paper-plane-icon.png', lightordark);
    changeIcons('search', 'search-icon.png', lightordark);
    changeIcons('bubble', 'speech-bubble-line-icon.png', lightordark);
    changeIcons('bin', 'trashbin.png', lightordark);
    changeIcons('sugg', 'sugg.png', lightordark);

}


function darkColors(){
    document.getElementById('logo-headline').innerHTML = `noch finsterer`;
    document.getElementById('logo-headline').style.color = "white";
    document.getElementById('logo-bg').style.background = "black";
    document.getElementById('body').classList.add('background');
    document.getElementById('body').style.color = "white";
    document.getElementById('headline').classList.add('headline-dark');
    document.getElementById('headline').classList.remove('headline-light');
    document.getElementById('headline').innerHTML = `happy mode`;
    document.getElementById('header-box').classList.remove('white');
    document.getElementById('header-box').classList.add('black');
}

function lightColors(){
    document.getElementById('logo-headline').innerHTML = `finster`;
    document.getElementById('logo-headline').style.color = "rgb(48, 48, 107)";
    document.getElementById('logo-bg').style.background = "linear-gradient(to bottom left, rgb(105, 26, 224), rgb(230, 28, 115), rgb(245, 255, 51))";
    document.getElementById('body').classList.remove('background');
    document.getElementById('body').style.color = "unset";
    document.getElementById('headline').classList.add('headline-light');
    document.getElementById('headline').classList.remove('headline-dark');
    document.getElementById('headline').innerHTML = `dark mode`;
    document.getElementById('header-box').classList.add('white');
    document.getElementById('header-box').classList.remove('black');
}


function darkMode(){
    darkColors();
    changeHeaderIcons('dark');
    renderPosts(lastActive);
}


function lightMode(){
    lightColors();
    changeHeaderIcons('light');
    renderPosts(lastActive);
}


function lightIcons(id, filename){
    let icon = document.getElementById(`header-${id}`);
    icon.src = `icon/${filename}`;
}


//////////////////////////////////////////////// follow like comment ////////////////////

function follow(index){
    if (user[index]['followed'] === false) {
        user[index]['followed'] = true;
        followedUsers++;
        save();
        renderFollowed();
        document.getElementById(`follow${index}`).innerHTML = `nicht folgen`; 
    }
    else{
        user[index]['followed'] = false;
        followedUsers--;
        save();
        renderFollowed();
        document.getElementById(`follow${index}`).innerHTML = `folgen`;
    }
}


function comment(activeuser, index){
    let input = document.getElementById(`input${index}`);
        user[activeuser]['posts'][index][0]['nicecomments'][0].push(input.value);
        user[activeuser]['posts'][index][0]['meancomments'][0].push(input.value);
        save();
        document.getElementById(`comments${index}`).innerHTML +=`
    <p class="comment">${input.value}</p>
    `;
    input.value = '';  
}


function highlight(){
    for (let i = 0; i < user.length; i++) {
        document.getElementById(`userimsugg${i}`).style.border = "5px solid transparent";
        if (user[i]['followed'] === true) {
            document.getElementById(`userimfollow${i}`).style.background = "linear-gradient(to bottom left, rgb(105, 26, 224), rgb(230, 28, 115), rgb(245, 255, 51))";
        }
    }
        document.getElementById(`userimsugg${lastActive}`).style.border = "5px solid rgb(38, 174, 254)";
       if (user[lastActive]['followed'] === true) {
        document.getElementById(`userimfollow${lastActive}`).style.background = "rgb(38, 174, 254)";
       }
}


function allowEnter(){
    for (let i = 0; i < numberOfPostsForUser; i++) {
        let input = document.getElementById(`input${i}`);
        input.addEventListener('keypress', function (event) {
          if (event.key === "Enter") {
            event.preventDefault();
            document.getElementById(`blabla${i}`).click();
          }
        });
    }
}


function like(activeuser, index){
    if (user[activeuser]['posts'][index][0]['liked'] === true) {
            let dislike = document.getElementById(`like${index}`);
            dislike.src = `icon/${mode}heart-thin-icon.png`;
            user[activeuser]['posts'][index][0]['liked'] = false;
            user[activeuser]['posts'][index][0]['numberoflikes']--;
            save(activeuser);
            document.getElementById(`numberoflikes${index}`).innerHTML = `
            Gefällt ${user[activeuser]['posts'][index][0]['numberoflikes']} mal ${notliked}
            `;  
    }
    else{
        let like = document.getElementById(`like${index}`);
        like.src = `icon/${mode}red-heart-icon.png`;
        user[activeuser]['posts'][index][0]['liked'] = true;
        user[activeuser]['posts'][index][0]['numberoflikes']++;
        save(activeuser);
        document.getElementById(`numberoflikes${index}`).innerHTML = `
        Gefällt ${user[activeuser]['posts'][index][0]['numberoflikes']} mal ${notliked}
        `;
    }
}


////////////////// animations of posts-Icons /////////////////////////////////////////////////


function bookmark(index){
    if (bookmarked === true) {
        let unbookmark = document.getElementById(`bookmark${index}`);
        unbookmark.src = `icon/${mode}book-line-icon.png`
        bookmarked = false;
        }
        else{
            let bookmark = document.getElementById(`bookmark${index}`);
            setTimeout(() => {
                bookmark.src = `icon/${mode}read-book-icon.png`;
                setTimeout(() => {
                    bookmark.src = `icon/${mode}read-book-icon1.png`;
                    setTimeout(() => {
                        bookmark.src = `icon/${mode}read-book-icon2.png`;
                        setTimeout(() => {
                            bookmark.src = `icon/${mode}read-book-icon3.png`;
                            setTimeout(() => {
                                bookmark.src = `icon/${mode}read-book-icon4.png`;
                                setTimeout(() => {
                                    bookmark.src = `icon/${mode}book-literature-icon.png`;
                                }, 30);
                            }, 30);
                        }, 30);
                    }, 30);
                }, 30);
            }, 20);
            bookmarked = true; 
        }
}


function sarcasm(activeuser, index){
    let sarcasm = document.getElementById(`sarcasm${index}`);
    sarcasm.src = `icon/${mode}quotation-mark-outline-icon-filled.png`;
    setTimeout(() => {
            sarcasm.src = `icon/${mode}quotation-mark-outline-icon.png`;        
    }, 225);
    user[activeuser]['posts'][index][0]['nicecomments'][0].push('Das war Sarkasmus');
    user[activeuser]['posts'][index][0]['meancomments'][0].push('Das war Sarkasmus');
    save();
    document.getElementById(`comments${index}`).innerHTML +=`
    <p class="comment">Das war Sarkasmus!</p>
    `;

}


function flyaway(index){
    if (mode === "nice") {
        let paperplane = document.getElementById(`plane${index}`);
        paperplane.src = `icon/${mode}paper-plane-icon-white.png`;
        paperplane.style.transform = "translate(100vw, -200vh)";
    }

}


function giveLove(activeuser, index){
    let givelove = document.getElementById(`love${index}`);
    givelove.src = `icon/${mode}happy-icon-filled.png`;
    setTimeout(() => {
        givelove.src = `icon/${mode}happy-icon.png`;        
    }, 225);
    let random = Math.floor((Math.random()) * niceComments.length);
    user[activeuser]['posts'][index][0]['nicecomments'][0].push(niceComments[random]);
    let random1 = Math.floor((Math.random()) * meanComments.length);
    user[activeuser]['posts'][index][0]['meancomments'][0].push(meanComments[random1]);
    save();
    if (mode === "nice") {
        document.getElementById(`comments${index}`).innerHTML +=`
        <p class="comment">${niceComments[random]}</p>`;
    }
    else{
        document.getElementById(`comments${index}`).innerHTML +=`
        <p class="comment">${meanComments[random1]}</p>`;
    }
}


function showOverlay(){
    if (overlayShown === false) {
        document.getElementById('sugg-container').classList.add('showoverlay');
        document.getElementById('header-sugg').src = `icon/${mode}sugg-close.png`; 
        document.getElementById('headline').style.display = "none";
        document.documentElement.scrollTop = 0;
        overlayShown = true;

    }
    else{
        document.getElementById('sugg-container').classList.remove('showoverlay');
        document.getElementById('header-sugg').src = `icon/${mode}sugg.png`; 
        document.getElementById('headline').style.display = "unset";

        overlayShown = false;
    }

}

//////////////////////////// save to local storage functions /////////////


function saveLastActive(){
    let savelastasText = JSON.stringify(lastActive);
    localStorage.setItem('lastactive', savelastasText);
}


function save(){
    let usersasText = JSON.stringify(user);
    localStorage.setItem('userasText', usersasText);
    let followedUsersasText = JSON.stringify(followedUsers);
    localStorage.setItem('followedUsers', followedUsersasText);
}


function load(){
    let usertext = localStorage.getItem('userasText');  
    if (usertext) {
        user = JSON.parse(usertext);
    }
    let followedUserstext = localStorage.getItem('followedUsers');
    followedUsers = JSON.parse(followedUserstext);
    let lastactivetext = localStorage.getItem('lastactive');
    lastActive = JSON.parse(lastactivetext);
}


function getHeart(activeuser, index) {
    return user[activeuser]['posts'][index][0].liked ? `${mode}red-heart-icon.png` : `${mode}heart-thin-icon.png`;
}


function getFollowed(index){
    return user[index].followed ? `nicht folgen` : `folgen`
}


////////////////////////// HTML-generating-Functions ////////////////////////////////


function renderPosts(activeuser){
    lastActive = activeuser;
    saveLastActive();
    user[activeuser]['active'] = true;
    document.getElementById('headline').classList.remove('hide');
    let postContainer = document.getElementById('posts-container');
    postContainer.innerHTML = '';
    for (let i = 0; i < numberOfPostsForUser; i++) {
    postContainer.innerHTML += `
    <div class="post-card">
        <div class="card-header">
            <div class="user-image-card">
                <div class="image-background">
                    <img src="${user[activeuser]['profilepic']}">
                </div>
            </div>
            <div>
                <div class="user-name">${user[activeuser]['firstname']} ${user[activeuser]['lastname']}</div>
                <div class="user-location">${user[activeuser]['location']}</div>
            </div>
        </div>
        <div class="card-image">
            <img src="img/posts/post${user[activeuser]['posts'][i][0]['pic']}.jpg" alt="">
        </div>
        <div class="icons-line">
            <div class="icons-line-left" id="iconsleft${i}">
                <img onclick="like(${activeuser}, ${i})" id="like${i}" src="icon/${getHeart(activeuser, i)}" alt="">
                <img onclick="comment(${activeuser}, ${i})" id="blabla${i}" src="icon/${mode}speech-bubble-line-icon.png" alt="">
                <img class="plane" onclick="flyaway(${i})" src="icon/${mode}paper-plane-icon.png" id="plane${i}" alt="">
                <img onclick="giveLove(${activeuser}, ${i})"id="love${i}" src="icon/${mode}happy-icon.png" alt="">
                <img onclick="sarcasm(${activeuser}, ${i})" id="sarcasm${i}" src="icon/${mode}quotation-mark-outline-icon.png" alt="">
            </div>
            <div class="icons-line-right" id="iconsright${i}">
                <img onclick="bookmark(${i})" id="bookmark${i}" src="icon/${mode}book-line-icon.png" alt="">
            </div>
        </div>
        <div class="number-of-likes" id="numberoflikes${i}">
            Gefällt ${user[activeuser]['posts'][i][0]['numberoflikes']} mal ${notliked}
        </div>
        <div>
            <p class="user-name">comments:</p>
            <div id="comments${i}">
            </div>
        </div>
        <input id="input${i}" class="new-comment" type="text" placeholder="Dein Kommentar">
    </div>`;
     renderComments(activeuser, i);
    }
    allowEnter();
    highlight();
  
}


function renderSuggestions(){
    let suggContainer = document.getElementById('sugg-box');
    for (let i = 0; i < user.length; i++) {
        let us = user[i];
        suggContainer.innerHTML += `
        <div class="sugg-card">
            <div class="sugg-profile">
                <div> 
                    <img onclick="renderPosts(${i})" src="${us['profilepic']}" id="userimsugg${i}" class="user-im-sugg">
                </div>
            </div>
            <div class="sugg-name-follow">
                <div class="sugg-name" onclick="renderPosts(${i})" >
                    ${us['firstname']} ${us['lastname']}
                </div>
                <div onclick="follow(${i})" id="follow${i}" class="sugg-follow">
                     ${getFollowed(i)}
                </div>
            </div>
        </div>`;
    }
}


function renderFollowed(){
    let follow = document.getElementById('follower-box');
    follow.innerHTML = '';
    for (let i = 0; i < user.length; i++) {
        if (user[i]['followed'] === true) {
            follow.innerHTML += `
            <div onclick="renderPosts(${i})" class="user-image">
                <div class="image-background" id="userimfollow${i}">
                    <img src="${user[i]['profilepic']}">
                </div>
            </div>`;
        } 
    }
    if (followedUsers === 0) {
        follow.innerHTML = '<p class="sugg-card-newpeople">Du folgst noch niemandem</p>';  
    }
    highlight();
}


function renderComments(activeuser, index){
    let comments = document.getElementById(`comments${index}`);
    for (let i = 0; i < user[activeuser]['posts'][index][0][`${mode}comments`][0].length; i++) {
        comments.innerHTML += `
        <p class="comment">${user[activeuser]['posts'][index][0][`${mode}comments`][0][i]}</p>
        `;  
    }
 
    
}