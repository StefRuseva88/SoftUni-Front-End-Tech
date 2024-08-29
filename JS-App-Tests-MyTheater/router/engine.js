import page from '../node_modules/page/page.mjs';
import {viewHandler} from './viewHandler.js';

function start(){

    page(viewHandler.navView);

    page('/', viewHandler.homeView);
    page('/login', viewHandler.loginView);
    page('/register', viewHandler.registerView);
    page('/logout', viewHandler.logoutView);
    page('/details/:id', viewHandler.detailsView);
    page('/create', viewHandler.createView);
    page('/edit/:id', viewHandler.editView);
    page('/delete/:id', viewHandler.deleteView)
    page('/profile', viewHandler.catalogView);
    page('/like/:id', viewHandler.likeView);

    page.start();
}

export const engine = {
    start
}