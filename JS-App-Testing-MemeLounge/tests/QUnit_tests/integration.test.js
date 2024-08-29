const baseUrl = 'http://localhost:3030/';

let user = {
    username: "threed",
    email: "",
    password: "123456",
    gender: "female"
};

let token = "";
let userId = "";

let lastCreatedMemeId = "";
let meme = {
    title: "",
    description: "",
    imageUrl: "/images/2.png"
};

QUnit.config.reorder = false;

QUnit.module("User functionalities", () => {
    QUnit.test("User Registration", async (assert) => {
        let path = 'users/register';

        let random = Math.floor(Math.random() * 10000);
        let randomUserName = `Test_User${random}`;
        let randomEmail = `abv${random}@abv.bg`;

        user.username = randomUserName;
        user.email = randomEmail;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(user)
        });

        assert.ok(response.ok, "Successful response");

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('email'), 'Email is present');
        assert.equal(jsonResponse['email'], user.email, 'Expected email');
        assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('username'), 'Username is present');
        assert.equal(jsonResponse['username'], user.username, 'Expected username');
        assert.strictEqual(typeof jsonResponse.username, 'string', 'Username value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), 'Password is present');
        assert.equal(jsonResponse['password'], user.password, 'Expected password');
        assert.strictEqual(typeof jsonResponse.password, 'string', 'Password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('gender'), 'Gender is present');
        assert.equal(jsonResponse['gender'], user.gender, 'Expected gender');
        assert.strictEqual(typeof jsonResponse.gender, 'string', 'Gender value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'AccessToken is present');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'AccessToken value is a string');

        token = jsonResponse.accessToken; // save token for future requests
        userId = jsonResponse._id; // save user id for future requests
        
        sessionStorage.setItem('meme-user', JSON.stringify(user));
    });

    QUnit.test("User Login", async (assert) => {
        let path = 'users/login';
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                password: user.password
            })
        });

        assert.ok(response.ok, "Successful response");

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('email'), 'Email is present');
        assert.equal(jsonResponse['email'], user.email, 'Expected email');
        assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('username'), 'Username is present');
        assert.equal(jsonResponse['username'], user.username, 'Expected username');
        assert.strictEqual(typeof jsonResponse.username, 'string', 'Username value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), 'Password is present');
        assert.equal(jsonResponse['password'], user.password, 'Expected password');
        assert.strictEqual(typeof jsonResponse.password, 'string', 'Password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('gender'), 'Gender is present');
        assert.equal(jsonResponse['gender'], user.gender, 'Expected gender');
        assert.strictEqual(typeof jsonResponse.gender, 'string', 'Gender value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'AccessToken is present');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'AccessToken value is a string');

        token = jsonResponse.accessToken; // save token for future requests
        userId = jsonResponse._id; // save user id for future requests
        sessionStorage.setItem('meme-user', JSON.stringify(user));
    });
});

QUnit.module('Meme functionalities', () => {
    QUnit.test('Get all memes', async (assert) => {
        let path = 'data/memes';
        let queryParams = '?sortBy=_createdOn%20desc';
        let response = await fetch(baseUrl + path + queryParams);

        assert.ok(response.ok, 'Successful response');
        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(Array.isArray(jsonResponse), 'Response is an array');

        jsonResponse.forEach(element => {
            assert.ok(element.hasOwnProperty('_id'), 'Id is present');
            assert.strictEqual(typeof element._id, 'string', 'Id value is a string');

            assert.ok(element.hasOwnProperty('title'), 'Title is present');
            assert.strictEqual(typeof element.title, 'string', 'Title value is a string');

            assert.ok(element.hasOwnProperty('description'), 'Description is present');
            assert.strictEqual(typeof element.description, 'string', 'Description value is a string');

            assert.ok(element.hasOwnProperty('imageUrl'), 'ImageUrl is present');
            assert.strictEqual(typeof element.imageUrl, 'string', 'ImageUrl value is a string');

            assert.ok(element.hasOwnProperty('_ownerId'), 'OwnerId is present');
            assert.strictEqual(typeof element._ownerId, 'string', 'OwnerId value is a string');

            assert.ok(element.hasOwnProperty('_createdOn'), 'CreatedOn is present');
            assert.strictEqual(typeof element._createdOn, 'number', 'CreatedOn value is a number');
        });
    });

    QUnit.test('Create meme', async (assert) => {
        let path = 'data/memes';
        let random = Math.floor(Math.random() * 10000);

        meme.title = `Random_Title_${random}`;
        meme.description = `Random_Description_${random}`;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(meme)
        });

        assert.ok(response.ok, 'Successful response');
        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('title'), 'Title is present');
        assert.strictEqual(jsonResponse.title, meme.title, 'Expected title');
        assert.strictEqual(typeof jsonResponse.title, 'string', 'Title value is a string');

        assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
        assert.strictEqual(jsonResponse.description, meme.description, 'Expected description');
        assert.strictEqual(typeof jsonResponse.description, 'string', 'Description value is a string');

        assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'ImageUrl is present');
        assert.strictEqual(jsonResponse.imageUrl, meme.imageUrl, 'Expected imageUrl');
        assert.strictEqual(typeof jsonResponse.imageUrl, 'string', 'ImageUrl value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_ownerId'), '_ownerId is present');
        assert.strictEqual(typeof jsonResponse._ownerId, 'string', '_ownerId value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), '_createdOn is present');
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', '_createdOn value is a number');

        lastCreatedMemeId = jsonResponse._id;
    });

    QUnit.test('Edit meme', async (assert) => {
        let path = `data/memes/`;
        let random = Math.floor(Math.random() * 10000);

        meme.title = `Edited_Title_${random}`;
        meme.description = `Edited_Description_${random}`;

        let response = await fetch(baseUrl + path + lastCreatedMemeId, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(meme)
        });

        assert.ok(response.ok, 'Successful response');

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(jsonResponse.hasOwnProperty('title'), 'Title is present');
        assert.strictEqual(jsonResponse.title, meme.title, 'Expected title');
        assert.strictEqual(typeof jsonResponse.title, 'string', 'Title value is a string');

        assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
        assert.strictEqual(jsonResponse.description, meme.description, 'Expected description');
        assert.strictEqual(typeof jsonResponse.description, 'string', 'Description value is a string');

        assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'ImageUrl is present');
        assert.strictEqual(jsonResponse.imageUrl, meme.imageUrl, 'Expected imageUrl');
        assert.strictEqual(typeof jsonResponse.imageUrl, 'string', 'ImageUrl value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_ownerId'), '_ownerId is present');
        assert.strictEqual(typeof jsonResponse._ownerId, 'string', '_ownerId value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), '_createdOn is present');
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', '_createdOn value is a number');
    });

    QUnit.test('Delete meme', async (assert) => {
        let path = `data/memes/`;

        let response = await fetch(baseUrl + path + lastCreatedMemeId, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            },
        });
        assert.ok(response.ok, 'Successful response');
    });
});
