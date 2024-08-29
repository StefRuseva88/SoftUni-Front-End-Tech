const baseUrl = 'http://localhost:3030/';

let user = {
    email: "",
    password: "123456",
};

let token = '';
let userId = "";

let lastCreatedAlbumId = "";
let testAlbum = {
    name: "Random album title_67373",
    artist: "",
    description: "",
    genre: "",
    imgUrl: "/images/pinkFloyd.jpg",
    price: "15.25",
    releaseDate: "29 June 2024"
};

QUnit.config.reorder = false;

QUnit.module('User Functionalities', () => {
    QUnit.test('Register user', async (assert) => {
        let path = 'users/register';
        let random = Math.floor(Math.random() * 10000);
        let randomEmail = `abv${random}@abv.bg`;
        user.email = randomEmail;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");

        assert.ok(jsonResponse.hasOwnProperty('email'), "Email exists in response");
        assert.equal(jsonResponse['email'], user.email, "Emails match");
        assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), "Password exists in response");
        assert.equal(jsonResponse['password'], user.password, "Passwords match");
        assert.strictEqual(typeof jsonResponse.password, 'string', 'Password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), "_createdOn exists in response");
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', '_createdOn value is a number');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'AccessToken is present');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'AccessToken value is a string');

        token = jsonResponse.accessToken; // save token for future requests
        userId = jsonResponse._id; // save user id for future requests
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });

    QUnit.test('Login user', async (assert) => {
        let path = 'users/login';
        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");

        assert.ok(jsonResponse.hasOwnProperty('email'), "Email exists in response");
        assert.equal(jsonResponse['email'], user.email, "Emails match");
        assert.strictEqual(typeof jsonResponse.email, 'string', 'Email value is a string');

        assert.ok(jsonResponse.hasOwnProperty('password'), "Password exists in response");
        assert.equal(jsonResponse['password'], user.password, "Passwords match");
        assert.strictEqual(typeof jsonResponse.password, 'string', 'Password value is a string');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), "_createdOn exists in response");
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', '_createdOn value is a number');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('accessToken'), 'AccessToken is present');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'AccessToken value is a string');

        token = jsonResponse.accessToken; // save token for future requests
        userId = jsonResponse._id; // save user id for future requests
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });
});

QUnit.module('Album Functionalities', () => {
    QUnit.test('Get all albums', async (assert) => {
        let path = 'data/albums';
        let queryParam = `?sortBy=_createdOn%20desc&distinct=name`;
        let response = await fetch(baseUrl + path + queryParam);
        let jsonResponse = await response.json();

        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");
        assert.ok(Array.isArray(jsonResponse), "Response is an array");

        jsonResponse.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('artist'), 'Artist is present');
            assert.strictEqual(typeof jsonData.artist, 'string', 'Artist value is a string');

            assert.ok(jsonData.hasOwnProperty('description'), 'Description is present');
            assert.strictEqual(typeof jsonData.description, 'string', 'Description value is a string');

            assert.ok(jsonData.hasOwnProperty('genre'), 'Genre is present');
            assert.strictEqual(typeof jsonData.genre, 'string', 'Genre value is a string');

            assert.ok(jsonData.hasOwnProperty('imgUrl'), 'ImgUrl is present');
            assert.strictEqual(typeof jsonData.imgUrl, 'string', 'ImgUrl value is a string');

            assert.ok(jsonData.hasOwnProperty('name'), 'Name is present');
            assert.strictEqual(typeof jsonData.name, 'string', 'Name value is a string');

            assert.ok(jsonData.hasOwnProperty('price'), 'Price is present');
            assert.strictEqual(typeof jsonData.price, 'string', 'Price value is a string');

            assert.ok(jsonData.hasOwnProperty('releaseDate'), 'releaseDate is present');
            assert.strictEqual(typeof jsonData.releaseDate, 'string', 'releaseDate value is a string');

            assert.ok(jsonData.hasOwnProperty('_createdOn'), 'CreatedOn is present');
            assert.strictEqual(typeof jsonData._createdOn, 'number', 'CreatedOn value is a number');

            assert.ok(jsonData.hasOwnProperty('_id'), 'Id is present');
            assert.strictEqual(typeof jsonData._id, 'string', 'Id value is a string');

            assert.ok(jsonData.hasOwnProperty('_ownerId'), 'OwnerId is present');
            assert.strictEqual(typeof jsonData._ownerId, 'string', 'OwnerId value is a string');
        });

        QUnit.test('Create Album', async (assert) => {
            let path = 'data/albums';
            let random = Math.floor(Math.random() * 10000);
            testAlbum.name = `Random Title ${random}`;
            testAlbum.description = `Random Description ${random}`;

            let response = await fetch(baseUrl + path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body: JSON.stringify(testAlbum)
            });

            let jsonResponse = await response.json();
            console.log(jsonResponse);

            assert.ok(response.ok, "Successful response");

            assert.ok(jsonResponse.hasOwnProperty('artist'), 'Artist is present');
            assert.strictEqual(typeof jsonResponse.artist, 'string', 'Artist value is a string');

            assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
            assert.strictEqual(typeof jsonResponse.description, 'string', 'Description value is a string');

            assert.ok(jsonResponse.hasOwnProperty('genre'), 'Genre is present');
            assert.strictEqual(typeof jsonResponse.genre, 'string', 'Genre value is a string');

            assert.ok(jsonResponse.hasOwnProperty('imgUrl'), 'ImgUrl is present');
            assert.strictEqual(typeof jsonResponse.imgUrl, 'string', 'ImgUrl value is a string');

            assert.ok(jsonResponse.hasOwnProperty('name'), 'Name is present');
            assert.strictEqual(typeof jsonResponse.name, 'string', 'Name value is a string');

            assert.ok(jsonResponse.hasOwnProperty('price'), 'Price is present');
            assert.strictEqual(typeof jsonResponse.price, 'string', 'Price value is a string');

            assert.ok(jsonResponse.hasOwnProperty('releaseDate'), 'releaseDate is present');
            assert.strictEqual(typeof jsonResponse.releaseDate, 'string', 'releaseDate value is a string');

            assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'CreatedOn is present');
            assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'CreatedOn value is a number');

            assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
            assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

            assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'OwnerId is present');
            assert.strictEqual(typeof jsonResponse._ownerId, 'string', 'OwnerId value is a string');

            lastCreatedAlbumId = jsonResponse._id;
        });

        QUnit.test('Edit Album', async (assert) => {
            let path = 'data/albums/';
            let random = Math.floor(Math.random() * 10000);

            testAlbum.name = `Random Title ${random}`;
            testAlbum.description = `Random Description ${random}`;

            let response = await fetch(baseUrl + path + lastCreatedAlbumId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': token
                },
                body: JSON.stringify(testAlbum)
            });

            let jsonResponse = await response.json();
            console.log(jsonResponse);

            assert.ok(response.ok, "Successful response");

            assert.ok(jsonResponse.hasOwnProperty('artist'), 'Artist is present');
            assert.strictEqual(typeof jsonResponse.artist, 'string', 'Artist value match');
    
            assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
            assert.strictEqual(typeof jsonResponse.description, 'string', 'Description value match');
    
            assert.ok(jsonResponse.hasOwnProperty('genre'), 'Genre is present');
            assert.strictEqual(typeof jsonResponse.genre, 'string', 'Genre value match');
    
            assert.ok(jsonResponse.hasOwnProperty('imgUrl'), 'ImgUrl is present');
            assert.strictEqual(typeof jsonResponse.imgUrl, 'string', 'ImgUrl value match');
    
            assert.ok(jsonResponse.hasOwnProperty('name'), 'Name is present');
            assert.strictEqual(typeof jsonResponse.name, 'string', 'Name value match');
    
            assert.ok(jsonResponse.hasOwnProperty('price'), 'Price is present');
            assert.strictEqual(typeof jsonResponse.price, 'string', 'Price value match');
    
            assert.ok(jsonResponse.hasOwnProperty('releaseDate'), 'releaseDate is present');
            assert.strictEqual(typeof jsonResponse.releaseDate, 'string', 'releaseDate value match');
    
            assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'CreatedOn is present');
            assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'CreatedOn value match');
    
            assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
            assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value match');
    
            assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'OwnerId is present');
            assert.strictEqual(typeof jsonResponse._ownerId, 'string', 'OwnerId value match');
        });

        QUnit.test('Delete Album', async (assert) => {
            let path = 'data/albums/';

            let response = await fetch(baseUrl + path + lastCreatedAlbumId, {
                method: 'DELETE',
                headers: {
                    'X-Authorization': token
                },
            });
            assert.ok(response.ok, 'Successful response');
        });
    });
});
