import page from '../node_modules/page/page.mjs'
import { requests } from '../api/requests.js'
import { userInfo } from '../util/userInfo.js'

async function onCreateSubmit(evt) {
    debugger;
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { title, description, imageUrl, type } = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, description, imageUrl, type)) {
        let item = {
            title,
            description,
            imageUrl,
            type
        }

        requests.items.create(item)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to create new book!');
                }
                page.redirect('/');
            })
            .catch(err => {
                alert(err.message);
            })
    } else {
        alert('No empty fields are allowed!');
    }
}

async function onLoginSubmit(evt) {
    debugger;
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { email, password } = Object.fromEntries(formData);

    await requests.user.login(email, password)
        .then(res => {
            if (!res.ok) {
                throw new Error('Unable to log: email or password does not exist!');
            }
            return res.json();
        })
        .then(user => {
            sessionStorage.setItem('books-user', JSON.stringify(user));
            page.redirect('/');
        })
        .catch(err => {
            alert(err.message);
        })



}

async function onRegisterSubmit(evt) {
    debugger;
    evt.preventDefault();
    let formData = new FormData(evt.currentTarget);

    let { email, password } = Object.fromEntries(formData);

    let repass = formData.get('confirm-pass');
    if (isValidRegister(email, password, repass)) {
        let userInfo = {
            email,
            password
        };

        requests.user.register(userInfo)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Already existing email or password!');
                }
                return res.json();
            })
            .then(data => {
                sessionStorage.setItem('books-user', JSON.stringify(data));
                page.redirect('/');
            })
            .catch(err => {
                alert(err.message);
            })
    } else {
        alert("All fields are required and confirm password has to match given password!")
    }
}

function onEditSubmit(evt) {
    evt.preventDefault();

    let id = evt.currentTarget.getAttribute('itemid');
    let formData = new FormData(evt.currentTarget);
    let { title, description, imageUrl, type } = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, description, imageUrl, type)) {
        let item = {
            title,
            description,
            imageUrl,
            type

        }

        requests.items.edit(item, id)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to edit this book!');
                }
                return res.json();
            })
            .then(book => {
                page.redirect(`/details/${book._id}`)
            })
            .catch(err => {
                alert(err.message);
            })
    }else {
        alert('No empty fields are allowed!');
    }
}


export const event = {
    onCreateSubmit,
    onLoginSubmit,
    onRegisterSubmit,
    onEditSubmit
}

function isValidRegister(email, pass, repass) {
    if (email == '' || pass == '' || repass == '') {
        return false;
    } else if (repass != pass) {
        return false;
    }
    return true;
}

function isValidCreatingOrEditing(title, description, imageUrl, type) {
    if (title == '' || description == '' || imageUrl == '' || type == '') {
        return false;
    }

    return true;
}