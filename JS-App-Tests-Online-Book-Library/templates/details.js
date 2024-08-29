import { html, nothing } from '../node_modules/lit-html/lit-html.js';
import { userInfo } from '../util/userInfo.js';


export function getDetailsView(item, likes, isNotLiked) { // change params with whatever u need
    return html`
    <section id="details-page" class="details">
            <div class="book-information">
                <h3>${item.title}</h3>
                <p class="type">Type: ${item.type}</p>
                <p class="img"><img src=${item.imageUrl.substring(0, 1) == '/' ? `..${item.imageUrl}` : item.imageUrl}></p>
                <div class="actions">
                    <!-- Edit/Delete buttons ( Only for creator of this book )  -->
                    ${userInfo.getUserObj() && userInfo.getUserObj()._id == item._ownerId
                        ? html`
                            <a class="button" href="/edit/${item._id}">Edit</a>
                            <a class="button" href="/delete/${item._id}">Delete</a>`
                        : nothing}

                    <!-- Bonus -->
                    <!-- Like button ( Only for logged-in users, which is not creators of the current book ) -->
                    ${userInfo.getUserObj() && userInfo.getUserObj()._id != item._ownerId && isNotLiked
                        ? html`<a class="button" href="/like/${item._id}">Like</a>`
                        : nothing}

                    <!-- ( for Guests and Users )  -->
                    <div class="likes">
                        <img class="hearts" src="../images/heart.png">
                        <span id="total-likes">Likes: ${likes > 0 ? likes : '0'}</span>
                    </div>
                    <!-- Bonus -->
                </div>
            </div>
            <div class="book-description">
                <h3>Description:</h3>
                <p>${item.description}</p>
            </div>
        </section>
`;
}

