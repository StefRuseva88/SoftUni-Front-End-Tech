import {url} from '../util/urls.js';
import {userInfo} from '../util/userInfo.js'

async function getAll(bookId){
    return await fetch(url.getLikesUrl() + `?where=bookId%3D%22${bookId}%22&distinct=_ownerId&count`)
    .then(res => res.json())
    .then(likes => likes);
}

async function hasALike(bookId, userId){
    return fetch(url.getLikesUrl() + `?where=bookId%3D%22${bookId}%22%20and%20_ownerId%3D%22${userId}%22&count`)
    .then(res => res.json())
    .then(like => like);
}
function likeIt(bookId){
    return fetch(url.getLikesUrl(), {
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            'X-Authorization' : userInfo.getToken()
        },
        body : JSON.stringify({
            bookId
        })
    });
}

export const likes = {
    getAll,
    hasALike,
    likeIt
}