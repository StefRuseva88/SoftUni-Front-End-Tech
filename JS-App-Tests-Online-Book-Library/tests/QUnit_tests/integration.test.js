const baseUrl = 'http://localhost:3030/';

let user = {
    email: '',
    password: '123456'
};

let token = '';
let userId = '';

let lastCreatedBookId = '';
let book = {
    title: "",
    description: "",
    imageUrl: "/images/book.png",
    type: "Other"
}

QUnit.config.reorder = false;

QUnit.module('User functionalities', () => {
    QUnit.test('Register user', async assert => {
         //arrange
         let path = 'users/register';
         let random = Math.floor(Math.random() * 10000);
         let email = `abv${random}@abv.bg`;
 
         user.email = email;
 
         //act
         let response = await fetch(baseUrl + path, {
             method: "POST",
             headers: {
                 'content-type' : 'application/json'
             },
             body: JSON.stringify(user)
         });
         let json = await response.json();
 
         //assert
         console.log(json);
         assert.ok(response.ok), 'Response is successful';
 
         assert.ok(json.hasOwnProperty('email'), 'Email property is present');
         assert.equal(json['email'], user.email, 'Email has correct value');
         assert.strictEqual(typeof json.email, 'string', "Email is a string");
 
         assert.ok(json.hasOwnProperty('password'), 'Password property is present');
         assert.equal(json['password'], user.password, 'Password has correct value');
         assert.strictEqual(typeof json.password, 'string', "Password is a string");
 
         assert.ok(json.hasOwnProperty('_createdOn'), 'CreatedOn property is present');
         assert.strictEqual(typeof json._createdOn, 'number', "CreatedOn is a number");
 
         assert.ok(json.hasOwnProperty('_id'), 'Id property is present');
         assert.strictEqual(typeof json._id, 'string', "Id has correct type");
 
         assert.ok(json.hasOwnProperty('accessToken'), 'AccessToken property is present');
         assert.strictEqual(typeof json.accessToken, 'string', "AccessToken is a string");
 
         token = json['accessToken'];
         userId = json['_id'];
         sessionStorage.setItem('book-user', JSON.stringify(user));
    });

    QUnit.test('Login user', async assert => {
        //arrange
        let path = "users/login";

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(user)
        });
        let json = await response.json();

        console.log("login response")
        console.log(json);

        //assert
        assert.ok(response.ok, 'Response is successful');

        assert.ok(json.hasOwnProperty('email'), 'Email property is present');
        assert.equal(json['email'], user.email, 'Email has correct value');
        assert.strictEqual(typeof json.email, 'string', "Email has correct type");

        assert.ok(json.hasOwnProperty('password'), 'Password property is present');
        assert.equal(json['password'], user.password, 'Password has correct value');
        assert.strictEqual(typeof json.password, 'string', "Password is a string");

        assert.ok(json.hasOwnProperty('_createdOn'), 'CreatedOn property is present');
        assert.strictEqual(typeof json._createdOn, 'number', "CreatedOn is a number");

        assert.ok(json.hasOwnProperty('_id'), 'Id property is present');
        assert.strictEqual(typeof json._id, 'string', "Id is a string");

        assert.ok(json.hasOwnProperty('accessToken'), 'AccessToken property is present');
        assert.strictEqual(typeof json.accessToken, 'string', "AccessToken is a string");

        token = json['accessToken'];
        userId = json['_id'];
        sessionStorage.setItem('book-user', JSON.stringify(user));
    });
});

QUnit.module('Book functionalities', () => {
    QUnit.test('Get all books', async assert => {
        //arrange
        let path = 'data/books';
        let queryParams = "?sortBy=_createdOn%20desc";

        //act
        let response = await fetch(baseUrl + path + queryParams);
        let json = await response.json();

        //assert
        console.log(json);
        assert.ok(response.ok, 'Response is successful');
        assert.ok(Array.isArray(json), "Response is an array");

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('description'), "Description exists");
            assert.strictEqual(typeof jsonData.description, 'string', "Description is a string");

            assert.ok(jsonData.hasOwnProperty('imageUrl'), "ImageUrl exists");
            assert.strictEqual(typeof jsonData.imageUrl, 'string', "ImageUrl is a string");

            assert.ok(jsonData.hasOwnProperty('title'), "Title exists");
            assert.strictEqual(typeof jsonData.title, 'string', "Title is a string");

            assert.ok(jsonData.hasOwnProperty('type'), "Type exists");
            assert.strictEqual(typeof jsonData.type, 'string', "Type is a string");

            assert.ok(jsonData.hasOwnProperty('_createdOn'), "CreatedOn exists");
            assert.strictEqual(typeof jsonData._createdOn, 'number', "CreatedOn is a number");

            assert.ok(jsonData.hasOwnProperty('_id'), "Id exists");
            assert.strictEqual(typeof jsonData._id, 'string', "Id is a string");

            assert.ok(jsonData.hasOwnProperty('_ownerId'), "OwnerId exists");
            assert.strictEqual(typeof jsonData._ownerId, 'string', "OwnerId is a string");
        });
    });
    QUnit.test('Create book', async assert => {
        //arrange
        let path = 'data/books';

        //act
        let response = await fetch(baseUrl + path, {
            method: "POST",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(book)
        });
        let json = await response.json();

        //assert
        console.log(json);
        assert.ok(response.ok, 'Response is successful');
        assert.ok(json.hasOwnProperty('description'), "Description exists");
        assert.strictEqual(json.description, book.description, "Description is a string");

        assert.ok(json.hasOwnProperty('imageUrl'), "ImageUrl exists");
        assert.strictEqual(json.imageUrl, book.imageUrl, "ImageUrl is a string");

        assert.ok(json.hasOwnProperty('title'), "Title exists");
        assert.strictEqual(json.title, book.title, "Title is is a string");

        assert.ok(json.hasOwnProperty('type'), "Type exists");
        assert.strictEqual(json.type, book.type, "Type is a string");

        assert.ok(json.hasOwnProperty('_createdOn'), "CreatedOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "CreatedOn is a number");

        assert.ok(json.hasOwnProperty('_id'), "Id exists");
        assert.strictEqual(typeof json._id, 'string', "Id is is a string");

        assert.ok(json.hasOwnProperty('_ownerId'), "OwnerId exists");
        assert.strictEqual(typeof json._ownerId, 'string', "OwnerId is a string");

        lastCreatedBookId = json._id;
    });

    QUnit.test('Edit book', async assert => {
        //arrange
        let path = `data/books/${lastCreatedBookId}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: "PUT",
            headers: {
                'content-type' : 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(book)
        });
        let json = await response.json();

        //assert
        console.log(json);
        assert.ok(response.ok, 'Response is successful');
        assert.ok(json.hasOwnProperty('description'), "Description exists");
        assert.strictEqual(json.description, book.description, "Description is a string");

        assert.ok(json.hasOwnProperty('imageUrl'), "ImageUrl exists");
        assert.strictEqual(json.imageUrl, book.imageUrl, "ImageUrl is a string");

        assert.ok(json.hasOwnProperty('title'), "Title exists");
        assert.strictEqual(json.title, book.title, "Title is is a string");

        assert.ok(json.hasOwnProperty('type'), "Type exists");
        assert.strictEqual(json.type, book.type, "Type is a string");

        assert.ok(json.hasOwnProperty('_createdOn'), "CreatedOn exists");
        assert.strictEqual(typeof json._createdOn, 'number', "CreatedOn is a number");

        assert.ok(json.hasOwnProperty('_id'), "Id exists");
        assert.strictEqual(typeof json._id, 'string', "Id is is a string");

        assert.ok(json.hasOwnProperty('_ownerId'), "OwnerId exists");
        assert.strictEqual(typeof json._ownerId, 'string', "OwnerId is a string");

    });

    QUnit.test('Delete book', async assert => {
        //arrange
        let path = `data/books/${lastCreatedBookId}`;

        //act
        let response = await fetch(baseUrl + path, {
            method: "DELETE",
            headers: {
                'X-Authorization': token
            }
        });
        let json = await response.json();

        //assert
        console.log(json);
        assert.ok(response.ok, 'Response is successful');
    });
});