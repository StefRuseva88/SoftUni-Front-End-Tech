import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';
import { requests } from '../api/requests.js';

export function getCatalogTemplate(items) {
    return html`
    <section id="my-books-page" class="my-books">
        <h1>My Books</h1>
        <!-- Display ul: with list-items for every user's books (if any) -->
        
        
        ${items && items.length > 0 
            ? html`<ul class="my-books-list">
                ${items.map(i => html`
                                <li class="otherBooks">
                                    <h3>${i.title}</h3>
                                    <p>Type: ${i.type}</p>
                                    <p class="img"><img src=${i.imageUrl.substring(0,1) == '/' ? `..${i.imageUrl}` : i.imageUrl}></p>
                                    <a class="button" href="/details/${i._id}">Details</a>
                                </li>`)}
            </ul>`
            : html`<p class="no-books">No books in database!</p>`}
    </section>`
}