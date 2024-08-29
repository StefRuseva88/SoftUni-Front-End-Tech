import {url} from '../util/urls.js';
import {userInfo} from '../util/userInfo.js'

async function getAll(){
    return await fetch(url.getTheatersUrl() + '?sortBy=_createdOn%20desc&distinct=title')
    .then(res => res.json())
    .then(items => items)
}
async function getAllMine(userId){
    return await fetch(url.getTheatersUrl() + `?where=_ownerId%3D%22${userId}%22&sortBy=_createdOn%20desc`)
    .then(res => res.json())
    .then(items => items)
}

async function getById(id){
    return await fetch(url.getTheatersUrl() + `/${id}`) 
    .then(res => res.json())
    .then(item => item);
}

function create(item){
    return fetch(url.getTheatersUrl(), {
        method : 'POST',
        headers : {
            'content-type' : 'application/json',
            'X-Authorization' : userInfo.getToken()
        },
        body : JSON.stringify(item)
    });
}

function deleteById(id){
    return fetch(url.getTheatersUrl() + `/${id}`, {
        method : 'DELETE',
        headers : { 'X-Authorization' : userInfo.getToken() }
    });
}

/**
 * 
 * @param {object} object should contain id of entity
 */
function edit(item, id){
    return fetch(url.getTheatersUrl() + `/${id}`, {
        method : 'PUT',
        headers : {
            'content-type' : 'application/json',
            'X-Authorization' : userInfo.getToken()
        },
        body : JSON.stringify(item)
    });
}

export const theaters = {
    getAll,
    getById,
    create,
    deleteById,
    edit,
    getAllMine
};