import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';
import { requests } from '../api/requests.js';

export function getCatalogTemplate(theaters, user) {
    return html`
    <section id="profilePage">
            <div class="userInfo">
                <div class="avatar">
                    <img src="../images/profilePic.png">
                </div>
                <h2>${user.email}</h2>
            </div>
            <div class="board">
                ${theaters && theaters.length > 0
                    ? theaters.map(t => html`
                                            <div class="eventBoard">
                                                <div class="event-info">
                                                    <img src=${t.imageUrl.substring(0,1) == '/' ? `..${t.imageUrl}` : t.imageUrl}>
                                                    <h2>${t.title}</h2>
                                                    <h6>${t.date}</h6>
                                                    <a href="/details/${t._id}" class="details-button">Details</a>
                                                </div>
                                            </div>`)
                    : html`<div class="no-events">
                                <p>This user has no events yet!</p>
                            </div>`}
                
            </div>
    </section>`;
}