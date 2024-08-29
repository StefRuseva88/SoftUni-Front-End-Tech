import { html } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';

export function getNavTemplate() {
    return html`
    <nav class="navbar">
        <section class="navbar-dashboard">
            <a href="/">Dashboard</a>
    
            ${userInfo.getUserObj()
            ? html`
            <!-- Logged-in users -->
                <div id="user">
                    <span>Welcome, ${userInfo.getUserObj().email}</span>
                    <a class="button" href="/mybooks">My Books</a>
                    <a class="button" href="/create">Add Book</a>
                    <a class="button" href="/logout">Logout</a>
                </div>`
            : html`
             <!-- Guest users -->
                <div id="guest">
                    <a class="button" href="/login">Login</a>
                    <a class="button" href="/register">Register</a>
                </div>`}
        </section>
    </nav>`;
}