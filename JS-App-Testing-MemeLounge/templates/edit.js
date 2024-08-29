import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { event } from '../util/eventHandler.js';

export function getEditTemplate(meme) {
    return html`
            <section id="edit-meme">
                    <form id="edit-form" @submit=${event.onEditSubmit} memeid=${meme._id}>
                        <h1>Edit Meme</h1>
                        <div class="container">
                            <label for="title">Title</label>
                            <input id="title" type="text" placeholder="Enter Title" name="title" value=${meme.title}>
                            <label for="description">Description</label>
                            <textarea id="description" placeholder="Enter Description" name="description">${meme.description}</textarea>
                            <label for="imageUrl">Image Url</label>
                            <input id="imageUrl" type="text" placeholder="Enter Meme ImageUrl" name="imageUrl" value=${meme.imageUrl}>
                            <input type="submit" class="registerbtn button" value="Edit Meme">
                        </div>
                    </form>
            </section>`;
}