const baseUrl = 'http://localhost:3030/';

let user = {
    email: "",
    password: "123456",
};

let token = '';
let userId = "";

let lastCreatedEventId = "";
let testEvent = {
    author: "Random Author",
    date: "24.06.2024",
    title: "",
    description: "",
    imageUrl: "/images/Pretty-Woman.jpg"
};

QUnit.config.reorder = false;

QUnit.module('User functionalities', () => {
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

        assert.ok(jsonResponse.hasOwnProperty ('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty ('accessToken'), 'AccessToken is present');
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

        assert.ok(jsonResponse.hasOwnProperty ('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty ('accessToken'), 'AccessToken is present');
        assert.strictEqual(typeof jsonResponse.accessToken, 'string', 'AccessToken value is a string');

        token = jsonResponse.accessToken; // save token for future requests
        userId = jsonResponse._id; // save user id for future requests
        sessionStorage.setItem('event-user', JSON.stringify(user));
    });
});

QUnit.module('Event Functionalities', () => {
    QUnit.test('Get all events', async (assert) => {

        let path = 'data/theaters';
        let queryparam = '?sortBy=_createdOn%20desc&distinct=title';
        
        let response = await fetch(baseUrl + path + queryparam);
        let jsonResponse = await response.json();

        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");
        assert.ok(Array.isArray(jsonResponse), "Response is an array");

        jsonResponse.forEach(jsonData => {

        assert.ok(jsonData.hasOwnProperty('author'), 'Author is present');
        assert.strictEqual(typeof jsonData.author, 'string', 'Id value is a string');

        assert.ok(jsonData.hasOwnProperty('date'), 'Date is present');
        assert.strictEqual(typeof jsonData.date, 'string', 'Title value is a string');

        assert.ok(jsonData.hasOwnProperty('description'), 'Description is present');
        assert.strictEqual(typeof jsonData.description, 'string', 'Description value is a string');

        assert.ok(jsonData.hasOwnProperty('imageUrl'), 'ImageUrl is present');
        assert.strictEqual(typeof jsonData.imageUrl, 'string', 'ImageUrl value is a string');

        assert.ok(jsonData.hasOwnProperty('_ownerId'), 'OwnerId is present');
        assert.strictEqual(typeof jsonData._ownerId, 'string', 'OwnerId value is a string');

        assert.ok(jsonData.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonData._id, 'string', 'OwnerId value is a string');

        assert.ok(jsonData.hasOwnProperty('title'), 'Title is present');
        assert.strictEqual(typeof jsonData.title, 'string', 'OwnerId value is a string');

        assert.ok(jsonData.hasOwnProperty('_createdOn'), 'CreatedOn is present');
        assert.strictEqual(typeof jsonData._createdOn, 'number', 'CreatedOn value is a number');
        });


    });

    QUnit.test('Create event', async (assert) => {

        let path = 'data/theaters';
        let random = Math.floor(Math.random() * 10000);
        testEvent.title = `Random Title ${random}`;
        testEvent.description = `Random Description ${random}`;


        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(testEvent)
        });

        let jsonResponse = await response.json();
        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");

        assert.ok(jsonResponse.hasOwnProperty('author'), 'Author is present');
        assert.strictEqual(jsonResponse.author, testEvent.author, 'Author values match');

        assert.ok(jsonResponse.hasOwnProperty('date'), 'Date is present');
        assert.strictEqual(jsonResponse.date, testEvent.date, 'Date values match');

        assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
        assert.strictEqual(jsonResponse.description, testEvent.description, 'Description values match');

        assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'ImageUrl is present');
        assert.strictEqual(jsonResponse.imageUrl, testEvent.imageUrl, 'ImageUrl values match');

        assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'OwnerId is present');
        assert.strictEqual(jsonResponse._ownerId, userId, 'OwnerId values match');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('title'), 'Title is present');
        assert.strictEqual(jsonResponse.title, testEvent.title, 'Title values match');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'CreatedOn is present');
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'CreatedOn value is a number');

        lastCreatedEventId = jsonResponse._id;

    });

    QUnit.test('Edit event', async (assert) => {
        let path = 'data/theaters';
        let random = Math.floor(Math.random() * 10000);

        testEvent.title = `Random Title ${random}`;
        testEvent.description = `Random Description ${random}`;

        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(testEvent)
        });
        
        let jsonResponse = await response.json();

        console.log(jsonResponse);

        assert.ok(response.ok, "Successful response");

        assert.ok(jsonResponse.hasOwnProperty('author'), 'Author is present');
        assert.strictEqual(jsonResponse.author, testEvent.author, 'Author values match');

        assert.ok(jsonResponse.hasOwnProperty('date'), 'Date is present');
        assert.strictEqual(jsonResponse.date, testEvent.date, 'Date values match');

        assert.ok(jsonResponse.hasOwnProperty('description'), 'Description is present');
        assert.strictEqual(jsonResponse.description, testEvent.description, 'Description values match');

        assert.ok(jsonResponse.hasOwnProperty('imageUrl'), 'ImageUrl is present');
        assert.strictEqual(jsonResponse.imageUrl, testEvent.imageUrl, 'ImageUrl values match');

        assert.ok(jsonResponse.hasOwnProperty('_ownerId'), 'OwnerId is present');
        assert.strictEqual(jsonResponse._ownerId, userId, 'OwnerId values match');

        assert.ok(jsonResponse.hasOwnProperty('_id'), 'Id is present');
        assert.strictEqual(typeof jsonResponse._id, 'string', 'Id value is a string');

        assert.ok(jsonResponse.hasOwnProperty('title'), 'Title is present');
        assert.strictEqual(jsonResponse.title, testEvent.title, 'Title values match');

        assert.ok(jsonResponse.hasOwnProperty('_createdOn'), 'CreatedOn is present');
        assert.strictEqual(typeof jsonResponse._createdOn, 'number', 'CreatedOn value is a number');
    });

    QUnit.test('Delete event', async (assert) => {
        let path = `data/theaters`;

        let response = await fetch(baseUrl + path + `/${lastCreatedEventId}`, {
            method: 'DELETE',
            headers: {
                'X-Authorization': token
            },
        });
        assert.ok(response.ok, 'Successful response');
    });
});