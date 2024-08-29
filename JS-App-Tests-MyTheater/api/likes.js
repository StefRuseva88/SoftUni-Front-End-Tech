import {url} from '../util/urls.js'
import {userInfo} from '../util/userInfo.js'

async function getAll(theaterId){
    return await fetch(url.getBaseUrl() + `/data/likes?where=theaterId%3D%22${theaterId}%22&distinct=_ownerId&count`)
    .then(res => res.json())
    .then(likes => likes);
}

function postALike(theaterId){
    return fetch(url.getBaseUrl() + '/data/likes', {
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            'X-Authorization' : userInfo.getToken()
        },
        body : JSON.stringify({theaterId})
    });
}

async function hasALike(theaterId, userId){
    return await fetch(url.getBaseUrl() + `/data/likes?where=theaterId%3D%22${theaterId}%22%20and%20_ownerId%3D%22${userId}%22&count`)
    .then(res => res.json())
    .then(like => like)}


export const likes = {
    getAll,
    postALike,
    hasALike
}