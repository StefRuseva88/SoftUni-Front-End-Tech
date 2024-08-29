import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';
import { requests } from '../api/requests.js';

export function getCatalogTemplate(memes) {
    return html`
    <section id="meme-feed">
            <h1>All Memes</h1>
            <div id="memes">
            ${memes && memes.length > 0 
                ? memes.map(m => html`
                                    <div class="meme">
                                            <div class="card">
                                                <div class="info">
                                                    <p class="meme-title">${m.title}</p>
                                                 <img class="meme-image" alt="meme-img" src=${m.imageUrl.substring(0,1) == '/' ? `..${m.imageUrl}` : m.imageUrl}>
                                                </div>
                                                <div id="data-buttons">
                                                    <a class="button" href="/details/${m._id}">Details</a>
                                                </div>
                                           </div>
                                    </div>`)
                
                : html`<p class="no-memes">No memes in database.</p>`}
				
			</div>
        </section>`;
}