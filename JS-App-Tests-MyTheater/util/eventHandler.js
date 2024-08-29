import page from '../node_modules/page/page.mjs'
import { requests } from '../api/requests.js'
import { userInfo } from '../util/userInfo.js'

async function onCreateSubmit(evt) {

    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { title, date, author, imageUrl, description } = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, date, author, imageUrl, description)) {
        let item = {
            title,
            date,
            author,
            imageUrl,
            description

        }

        requests.theaters.create(item)
        .then(res => {
            if(!res.ok){
                throw new Error('Unable to create a event!')
            }
            page.redirect('/');
        })
        .catch(err => {
            alert(err.message);
        })
    } else {
        alert('All fields are required!');
    }
}

async function onLoginSubmit(evt) {
    debugger;
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);

    let { email, password } = Object.fromEntries(formData);

    if (email == '' || password == '') {
        alert('All fileds are required');
    } else {
        await requests.user.login(email, password)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Email or password does not exist!');
                }
                return res.json();
            })
            .then(user => {
                sessionStorage.setItem('theater-user', JSON.stringify(user));
                page.redirect('/');
            })
            .catch(err => {
                alert(err.message);
            })
    }




}

async function onRegisterSubmit(evt) {
    debugger;
    evt.preventDefault();
    let formData = new FormData(evt.currentTarget);

    let { email, username, password, repeatPassword } = Object.fromEntries(formData);

    if (isValidRegister(email, username, password, repeatPassword)) {
        let userInfo = {
            email,
            username,
            password
        };

        requests.user.register(userInfo)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Unable to register new user!');
                }
                return res.json();
            })
            .then(data => {
                sessionStorage.setItem('theater-user', JSON.stringify(data));
                page.redirect('/');
            })
            .catch(err => {
                alert(err.message)
            })
    } else {
        alert('All fields are required and confirm password need to match password');
    }
}

function onEditSubmit(evt) {
    evt.preventDefault();

    let formData = new FormData(evt.currentTarget);
    let id = evt.currentTarget.getAttribute('theaterId');

    let { title, date, author, imageUrl, description} = Object.fromEntries(formData);

    if (isValidCreatingOrEditing(title, date, author, imageUrl, description)) {
        let item = {
            title, 
            date, 
            author, 
            imageUrl, 
            description
        }

        requests.theaters.edit(item, id)
            .then(res => {
                if (!res.ok) {
                    throw new Error();
                }
                return res.json();
            })
            .then(data => {
                page.redirect(`/details/${data._id}`)
            })
            .catch(err => {

            })
    }
    else {
        alert('All fields are required!');
    }
}



export const event = {
    onCreateSubmit,
    onLoginSubmit,
    onRegisterSubmit,
    onEditSubmit
}

function isValidRegister(email, username, password, repeatPassword) {

    if (email == '' || username == '' || password == '' || repeatPassword == '' || password != repeatPassword) {
        return false;
    }
    return true;
}

function isValidCreatingOrEditing(title, date, author, imageUrl, descriptio) {
    if(title == '' || date == '' || author == '' || imageUrl == '' || descriptio == ''){
        return false;
    }
    return true;
}