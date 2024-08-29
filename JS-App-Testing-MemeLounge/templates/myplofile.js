import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';
import { requests } from '../api/requests.js';

export function getProfileTemplate(memes, userInformation) {
    return html`
            <section id="user-profile-page" class="user-profile">
                    <article class="user-info">
                        <img id="user-avatar-url" alt="user-profile" src=${userInformation.gender == 'male' ? "../images/male.png" : "../images/female.png"}>
                        <div class="user-content">
                            <p>Username: ${userInformation.username}</p>
                            <p>Email: ${userInformation.email}</p>
                            <p>My memes count: ${memes ? memes.length : 0}</p>
                        </div>
                    </article>
                    <h1 id="user-listings-title">User Memes</h1>
                    <div class="user-meme-listings">
                        ${memes && memes.length > 0 
                            ? memes.map(m => html`
                                                <div class="user-meme">
                                                    <p class="user-meme-title">${m.title}</p>
                                                    <img class="userProfileImage" alt="meme-img" src=${m.imageUrl.substring(0,1) == '/' ? `..${m.imageUrl}` : m.imageUrl}>
                                                    <a class="button" href="/details/${m._id}">Details</a>
                                                </div>`)
                            : html`<p class="no-memes">No memes in database.</p>`} 
                        
                    </div>
            </section>`;
}