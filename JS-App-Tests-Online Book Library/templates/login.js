import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { event } from '../util/eventHandler.js'; 

export function getLoginTemplate() {
    return html`
    <!-- Login Page ( Only for Guest users ) -->
    <section id="login-page" class="login">
            <form id="login-form" action="" method="" @submit=${event.onLoginSubmit}>
                <fieldset>
                    <legend>Login Form</legend>
                    <p class="field">
                        <label for="email">Email</label>
                        <span class="input">
                            <input type="text" name="email" id="email" placeholder="Email">
                        </span>
                    </p>
                    <p class="field">
                        <label for="password">Password</label>
                        <span class="input">
                            <input type="password" name="password" id="password" placeholder="Password">
                        </span>
                    </p>
                    <input class="button submit" type="submit" value="Login">
                </fieldset>
            </form>
        </section>`;
}




