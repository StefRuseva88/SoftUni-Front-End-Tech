import { render } from '../node_modules/lit-html/lit-html.js'
import { templates } from '../templates/templates.js'
import { requests } from '../api/requests.js'
import page from '../node_modules/page/page.mjs';
import {userInfo} from '../util/userInfo.js'

let mainElement = document.querySelector('#container #site-content');
let headerElement = document.querySelector('#container #site-header');

async function homeView(ctx) {
    debugger;
    let items = await requests.items.getAll();
    render(templates.getHomeTemplate(items), mainElement);
}

async function catalogView(ctx) {
    
    let user = userInfo.getUserObj();
    let items = await requests.items.getMyItems(user._id);
    render(templates.getCatalogTemplate(items), mainElement);
}

function navView(ctx, next) {
    debugger;
    render(templates.getNavTemplate(), headerElement);
    next();
}

function loginView(ctx) {
    render(templates.getLoginTemplate(), mainElement);
}

function registerView(ctx) {
    render(templates.getRegisterTemplate(), mainElement);
}

function createView(ctx) {
    render(templates.getCreateView(), mainElement);
}

async function editView(ctx){
    let id = ctx.params.id;
    let item = await requests.items.getById(id);

    render(templates.getEditTemplate(item), mainElement);
}

async function detailsView(ctx) {
   
    let id = ctx.params.id;
    let item = await requests.items.getById(id);
    let likes = await requests.likes.getAll(id);
    let isNotLiked = true;
    if(userInfo.getUserObj()){
        let hasLike = await requests.likes.hasALike(id, userInfo.getUserObj()._id);
        if(hasLike == 1){
            isNotLiked = false;
        }
    } else {
        isNotLiked = false;
    }
    
    render(templates.getDetailsView(item, likes, isNotLiked), mainElement);
}

function deleteView(ctx){
    requests.items.deleteById(ctx.params.id)
    .then(res => {
        if(res.ok){
            page.redirect('/');
        }
    })
}

function logoutView(ctx){
    debugger;
    requests.user.logout()
    .then(res => {
        if(res.status == 204){
            sessionStorage.removeItem('books-user');
            page.redirect('/');
        }
    });
}

function likeView(ctx){
    let id = ctx.params.id;

    requests.likes.likeIt(id)
    .then(res => {
        if(res.ok){
            page.redirect(`/details/${id}`);
        }
    })
}

export const viewHandler = {
    navView,
    homeView,
    catalogView,
    loginView,
    registerView,
    logoutView,
    detailsView,
    createView,
    editView,
    deleteView,
    likeView
}