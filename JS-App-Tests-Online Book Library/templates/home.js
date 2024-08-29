import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';

export function getHomeTemplate(items) {
    return html`
    <section id="dashboard-page" class="dashboard">
        <h1>Dashboard</h1>
        <!-- Display ul: with list-items for All books (If any) -->
        
            ${items && items.length > 0 
            ? html`<ul class="other-books-list">
                ${items.map(i => html`
                                <li class="otherBooks">
                                    <h3>${i.title}</h3>
                                    <p>Type: ${i.type}</p>
                                    <p class="img"><img src=${i.imageUrl.substring(0,1) == '/' ? `..${i.imageUrl}` : i.imageUrl}></p>
                                    <a class="button" href="/details/${i._id}">Details</a>
                                </li>`)}
            </ul>`
            : html`<p class="no-books">No books in database!</p>`}
        <!-- Display paragraph: If there are no books in the database -->
        
    </section>`;
}

function getBooksTemplate(){

}