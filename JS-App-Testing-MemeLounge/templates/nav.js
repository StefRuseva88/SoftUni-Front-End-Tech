import { html } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';

export function getNavTemplate() {
    return html`
             <a href="/catalog">All Memes</a>
             ${userInfo.getUserObj()
                ? html`
                <!-- Logged users -->
                    <div class="user">
                         <a href="/create">Create Meme</a>
                        <div class="profile">
                             <span>Welcome, ${userInfo.getUserObj().email}</span>
                            <a href="/myprofile">My Profile</a>
                            <a href="/logout">Logout</a>
                        </div>
                    </div>`
                : html`
                 <!-- Guest users -->
                     <div class="guest">
                         <div class="profile">
                            <a href="/login">Login</a>
                             <a href="/register">Register</a>
                        </div>
                        <a class="active" href="/">Home Page</a>
                     </div>`}`  
}