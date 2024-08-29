import { render } from '../node_modules/lit-html/lit-html.js'
import { templates } from '../templates/templates.js'
import { requests } from '../api/requests.js'
import page from '../node_modules/page/page.mjs';
import { userInfo } from '../util/userInfo.js'

let mainElement = document.querySelector('#container #content');
let headerElement = document.querySelector('#container header');
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

async function homeView(ctx) {
    let theaters = await requests.theaters.getAll();
    render(templates.getHomeTemplate(theaters), mainElement);
}

async function catalogView(ctx) {
    let user = userInfo.getUserObj();
    let theaters = await requests.theaters.getAllMine(user._id);
    render(templates.getCatalogTemplate(theaters, user), mainElement);
}



function createView(ctx) {
    render(templates.getCreateView(), mainElement);
}

async function editView(ctx) {
    let theater = await requests.theaters.getById(ctx.params.id);

    render(templates.getEditTemplate(theater), mainElement)
}

async function detailsView(ctx) {
    debugger;
    let user = userInfo.getUserObj();
    let theater = await requests.theaters.getById(ctx.params.id);
    let likes = await requests.likes.getAll(ctx.params.id);
    let hasLike = await requests.likes.hasALike(ctx.params.id, user._id);
    let isNotLiked = hasLike == 0 ? true : false;
    render(templates.getDetailsView(theater, likes, isNotLiked), mainElement);
}

function deleteView(ctx) {
    if (confirm('Are you sure you want to delete it?') == true) {
        requests.theaters.deleteById(ctx.params.id)
            .then(res => {
                if (!res.ok) {
                    alert('Unable to delete!')
                }
                page.redirect('/profile');
            })
    } 
}

function logoutView(ctx) {
    debugger;
    requests.user.logout()
        .then(res => {
            if (res.status == 204) {
                sessionStorage.removeItem('theater-user');
                page.redirect('/');
            }
        });
}

function likeView(ctx) {
    requests.likes.postALike(ctx.params.id)
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to make a like!')
            }
            page.redirect(`/details/${ctx.params.id}`)
        })
        .catch(err => {
            alert(err.message);
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