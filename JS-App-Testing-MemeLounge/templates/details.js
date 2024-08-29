import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';
import { requests } from '../api/requests.js';
import page from '../node_modules/page/page.mjs'


export function getDetailsView(meme) { // change params with whatever u need
    return html`
                <section id="meme-details">
                        <h1>Meme Title: ${meme.title}s</h1>
                        <div class="meme-details">
                            <div class="meme-img">
                                <img alt="meme-alt" src=${meme.imageUrl.substring(0,1) == '/' ? `..${meme.imageUrl}` : meme.imageUrl}>
                            </div>
                            <div class="meme-description">
                                <h2>Meme Description</h2>
                                <p>${meme.description}</p>

                                <!-- Buttons Edit/Delete should be displayed only for creator of this meme  -->
                                ${userInfo.getUserObj() && userInfo.getUserObj()._id == meme._ownerId
                                    ? html`
                                        <a class="button warning" href="/edit/${meme._id}">Edit</a>
                                        <button class="button danger" @click=${onDeleteClick} memeid=${meme._id}>Delete</button>`
                                    : nothing }
                                

                            </div>
                        </div>
                </section>`;
}

function onDeleteClick(evt){
    debugger;
    evt.preventDefault();
    let id = evt.currentTarget.getAttribute('memeid');
    requests.items.deleteById(id)
    .then(res => {
        if(res.ok){
            page.redirect('/catalog');
        }
    })
}
