import page from '../node_modules/page/page.mjs'
import { requests } from '../api/requests.js'
import { userInfo } from '../util/userInfo.js'

let notificationElement = document.querySelector('#container #notifications .notification')

async function onCreateSubmit(evt) {

    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { title, description, imageUrl } = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, description, imageUrl)) {
        let item = {
            title,
            description,
            imageUrl
          
        }

        requests.items.create(item)
        .then(res => {
            if(!res.ok){
                throw new Error('Unable to create a meme!')
            }
            return res.json();
        })
        .then(meme => {
            page.redirect('/catalog');
        })
        .catch(err => showMessage(err.message))

    } else {
        showMessage('All fields are required!')
    }
}

async function onLoginSubmit(evt) {
    
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { email, password } = Object.fromEntries(formData);

    if(email == '' || password == ''){
        showMessage('No empty fields!')
    } else {
        requests.user.login(email, password)
        .then(res => {
            if (!res.ok) {
                throw new Error("Email or password don't match");
            }
            return res.json();
        })
        .then(user => {
            sessionStorage.setItem('meme-user', JSON.stringify(user));
            page.redirect('/catalog');
        })
        .catch(err => {
            showMessage(err.message);
        })
    }
    



}

async function onRegisterSubmit(evt) {
    
    evt.preventDefault();
    let formData = new FormData(evt.currentTarget);

    let { username, email, password, gender, repeatPass } = Object.fromEntries(formData);

    if (isValidRegister(username, email, password, gender, repeatPass)) {
        let userInfo = {
            username,
            email,
            password,
            gender

        };

        requests.user.register(userInfo)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Existing user or confirm password does not match!');
                }
                return res.json();
            })
            .then(data => {
                sessionStorage.setItem('meme-user', JSON.stringify(data));
                page.redirect('/catalog');
            })
            .catch(err => {
                showMessage(err.message);
            })
    } else {
        showMessage('All fields are required!')
    }
}

function onEditSubmit(evt) {
    
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);
    let id = evt.currentTarget.getAttribute('memeid');

    let {title, description, imageUrl } = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, description, imageUrl)) {
        let item = {
            title,
            description,
            imageUrl
          
        }

        requests.items.edit(item, id)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to edit this meme!');
                }
                return res.json();
            })
            .then(data => {
                page.redirect(`/details/${data._id}`)
            })
            .catch(err => {
                showMessage(err.message)
            })
    } else {
        showMessage('All fields are required!')
    }
}


export const event = {
    onCreateSubmit,
    onLoginSubmit,
    onRegisterSubmit,
    onEditSubmit
}

function isValidRegister(username, email, password, gender, repeatPass) {

    if (username == '' || email == '' || password == '' || gender == '' || password != repeatPass) {
        return false;
    }
    return true;
}

function isValidCreatingOrEditing(title, description, imageUrl) {
    if(title == '' || description == '' || imageUrl == ''){
        return false;
    }
    return true;
}

function showMessage(msg){
    let message = notificationElement.querySelector('span');
    message.textContent = msg;
    notificationElement.style.display = 'block';
    setTimeout(() => {
        notificationElement.style.display = 'none';
    }, 3000);
}