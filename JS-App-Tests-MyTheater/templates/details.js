import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';


export function getDetailsView(theater, likes, isNotLiked) { // change params with whatever u need
    return html`
    <section id="detailsPage">
            <div id="detailsBox">
                <div class="detailsInfo">
                    <h1>Title: ${theater.title}</h1>
                    <div>
                        <img src=${theater.imageUrl.substring(0,1) == '/' ? `..${theater.imageUrl}` : theater.imageUrl} />
                    </div>
                </div>

                <div class="details">
                    <h3>Theater Description</h3>
                    <p>${theater.description}</p>
                    <h4>Date: ${theater.date}</h4>
                    <h4>Author: ${theater.author}</h4>
                    <div class="buttons">
                        ${userInfo.getUserObj() && userInfo.getUserObj()._id == theater._ownerId 
                            ? html`
                                <a class="btn-delete" href="/delete/${theater._id}">Delete</a>
                                <a class="btn-edit" href="/edit/${theater._id}">Edit</a>`
                            : nothing }
                        ${userInfo.getUserObj() && userInfo.getUserObj()._id != theater._ownerId && isNotLiked
                            ? html`<a class="btn-like" href="/like/${theater._id}">Like</a>`
                            : nothing }
                    </div>
                    
                    <p class="likes">Likes: ${likes ? likes : 0}</p>
                </div>
            </div>
    </section>`;
}
