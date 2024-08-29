import { html } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';

export function getNavTemplate() {
    return html`
    <nav>
                <a href="/">Theater</a>
                <ul>
                    ${userInfo.getUserObj()
                        ? html`
                            <!--Only users-->
                                <li><a href="/profile">Profile</a></li>
                                <li><a href="/create">Create Event</a></li>
                                <li><a href="/logout">Logout</a></li>`
                        : html`
                            <!--Only guest-->
                                <li><a href="/login">Login</a></li>
                                <li><a href="/register">Register</a></li>`}
                </ul>
            </nav>`;
}