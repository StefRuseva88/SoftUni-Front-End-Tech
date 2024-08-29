const baseUrl = 'http://localhost:3030/';

let user = {
    email: "",
    password: "123456",
    confirmpass: "123456"
};


let token = "";
let userId = "";

let lastCreatedCardId = "";
let pet = {
    age : "",
    breed : "",
    image : "",
    weight : "",
};

QUnit.config.reorder = false;

QUnit.module('Authentication', () => {
    QUnit.test("Registration", async (assert) => {
        let path = 'users/register';

        let random = Math.floor(Math.random() * 10000)
        let email = `abv${random}@abv.bg`;

        user.email = email;

        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'
             },
            body : JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");
        let json = await response.json();
        console.log(json);
        
        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected mail");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        token = json['accessToken']; //get token
        userId = json['_id']; //get id
        sessionStorage.setItem('album-user', JSON.stringify(user)); //set token to session store in browser
    });

    QUnit.test("Login", async (assert) => {
        let path = 'users/login';

        let response = await fetch(baseUrl + path, {
            method : 'POST',
            headers : { 
                'content-type' : 'application/json'
             },
            body : JSON.stringify(user)
        });

        assert.ok(response.ok, "successful response");
        let json = await response.json();

        assert.ok(json.hasOwnProperty('email'), "email exist");
        assert.equal(json['email'], user.email, "expected mail");
        assert.strictEqual(typeof json.email, 'string', 'Property "email" is a string');

        assert.ok(json.hasOwnProperty('password'), "password exist");
        assert.equal(json['password'], user.password, "expected password");
        assert.strictEqual(typeof json.password, 'string', 'Property "password" is a string');

        assert.ok(json.hasOwnProperty('accessToken'), "accessToken exist");
        assert.strictEqual(typeof json.accessToken, 'string', 'Property "accessToken" is a string');

        assert.ok(json.hasOwnProperty('_id'), "id exist");
        assert.strictEqual(typeof json._id, 'string', 'Property "_id" is a string');

        token = json['accessToken']; //get token
        userId = json['_id']; //get id
        sessionStorage.setItem('album-user', JSON.stringify(user)); //set token to session store in browser
    });
});

QUnit.module('CRUD', () => {
    QUnit.test("Get all postcards", async (assert) => {
        let path = 'data/pets';
        let queryParam = '?sortBy=_createdOn%20desc&distinct=name'; // sort by createdOn descending
        
        let response = await fetch(baseUrl + path + queryParam);

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json);

        assert.ok(Array.isArray(json), "response is an array");

        json.forEach(jsonData => {
            assert.ok(jsonData.hasOwnProperty('_id'), "property '_id' exists");
            assert.strictEqual(typeof jsonData._id, 'string', "Property '_id' is a string");

            assert.ok(jsonData.hasOwnProperty('name'), "property 'name' exists");
            assert.strictEqual(typeof jsonData.name, 'string', "Property 'name' is a string");

            assert.ok(jsonData.hasOwnProperty('breed'), "property 'breed' exists");
            assert.strictEqual(typeof jsonData.breed, 'string', "Property 'breed' is a string");

            assert.ok(jsonData.hasOwnProperty('age'), "property 'age' exists");
            assert.strictEqual(typeof jsonData.age, 'string', "Property 'age' is a string");

            assert.ok(jsonData.hasOwnProperty('image'), "property 'image' exists");
            assert.strictEqual(typeof jsonData.image, 'string', "Property 'image' is a string");

            assert.ok(jsonData.hasOwnProperty('weight'), "property 'weight' exists");
            assert.strictEqual(typeof jsonData.weight, 'string', "Property 'weight' is a string");
        });
    });

    QUnit.test("Create postcard", async (assert) => {
        let path = 'data/pets';

        let random = Math.floor(Math.random() * 100000);

        pet.name = `Random pet name_${random}`;
        pet.age = `${random % 10 + 1} years`;
        pet.breed = `Random breed_${random}`;
        pet.image = "/images/cat-create.jpg";
        pet.weight = `${random % 10 + 1} kg`;

        let response = await fetch(baseUrl + path, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(pet)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty('_id'), "property '_id' exists");
        assert.strictEqual(typeof json._id, 'string', "Property '_id' is a string");

        assert.ok(json.hasOwnProperty('name'), "property 'name' exists");
        assert.strictEqual(typeof json.name, 'string', "Property 'name' is a string");

        assert.ok(json.hasOwnProperty('breed'), "property 'breed' exists");
        assert.strictEqual(typeof json.breed, 'string', "Property 'breed' is a string");

        assert.ok(json.hasOwnProperty('age'), "property 'age' exists");
        assert.strictEqual(typeof json.age, 'string', "Property 'age' is a string");

        assert.ok(json.hasOwnProperty('image'), "property 'image' exists");
        assert.strictEqual(typeof json.image, 'string', "Property 'image' is a string");

        assert.ok(json.hasOwnProperty('weight'), "property 'weight' exists");
        assert.strictEqual(typeof json.weight, 'string', "Property 'weight' is a string");

        lastCreatedCardId = json['_id']; // Store the ID for later use
    });

    QUnit.test("Edit postcard", async (assert) => {
        let path = `data/pets/${lastCreatedCardId}`;

        let random = Math.floor(Math.random() * 100000);

        pet.name = `Edited pet name_${random}`;

        let response = await fetch(baseUrl + path, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'X-Authorization': token
            },
            body: JSON.stringify(pet)
        });

        assert.ok(response.ok, "successful response");

        let json = await response.json();
        console.log(json);

        assert.ok(json.hasOwnProperty('_id'), "property '_id' exists");
        assert.strictEqual(typeof json._id, 'string', "Property '_id' is a string");

        assert.ok(json.hasOwnProperty('name'), "property 'name' exists");
        assert.strictEqual(typeof json.name, 'string', "Property 'name' is a string");

        // Ensure the updated name is correct
        assert.equal(json.name, pet.name, "name is updated");
    });

    QUnit.test("Delete postcard", async (assert) => {
        let path = `data/pets/${lastCreatedCardId}`;

        let response = await fetch(baseUrl + path, {
            method: 'DELETE',
            headers: { 'X-Authorization': token }
        });

        assert.ok(response.ok, "successful response");
    });
});

