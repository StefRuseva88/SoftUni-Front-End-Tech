import { render } from '../node_modules/lit-html/lit-html.js'
import { templates } from '../templates/templates.js'
import { requests } from '../api/requests.js'
import page from '../node_modules/page/page.mjs';
import {userInfo} from '../util/userInfo.js'

let mainElement = document.querySelector('#container main');
let navElement = document.querySelector('#container nav');
function navView(ctx, next) {
    debugger;
    render(templates.getNavTemplate(), navElement);
    next();
}

function loginView(ctx) {
    render(templates.getLoginTemplate(), mainElement);
}

function registerView(ctx) {
    render(templates.getRegisterTemplate(), mainElement);
}

function homeView(ctx) {
    let user = userInfo.getUserObj();
    if(user){

    } else {
        render(templates.getHomeTemplate(), mainElement);
    }
   
}

async function itemsView(ctx) {
    let teams = await requests.items.getAll();
    render(templates.getCatalogTemplate(teams), mainElement);
}



function createView(ctx) {
    render(templates.getCreateView(), mainElement);
}

async function editView(ctx){
    let meme = await requests.items.getById(ctx.params.id);

    render(templates.getEditTemplate(meme), mainElement)
}

async function detailsView(ctx) {
    debugger;
    let meme = await requests.items.getById(ctx.params.id);
    
    render(templates.getDetailsView(meme), mainElement);
}

// function deleteView(ctx){
//     requests.items.deleteById(ctx.params.id)
//     .then(res => {
//         if(res.ok){
//             page.redirect('/catalog');
//         }
//     })
// }

function logoutView(ctx){
    debugger;
    requests.user.logout()
    .then(res => {
        if(res.status == 204 || res.status == 200){
            sessionStorage.removeItem('meme-user');
            page.redirect('/');
        }
    });
}

async function profileView(ctx){
    let user = userInfo.getUserObj();
    let memes = await requests.items.getMyMemes(user._id);

    render(templates.getProfileTemplate(memes, user), mainElement);
}

export const viewHandler = {
    navView,
    homeView,
    itemsView,
    loginView,
    registerView,
    logoutView,
    detailsView,
    createView,
    editView,
    profileView
    //deleteView
}