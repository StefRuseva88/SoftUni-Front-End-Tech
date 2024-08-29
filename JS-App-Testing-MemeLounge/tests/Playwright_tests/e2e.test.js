const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
    username : "",
    email : "",
    password : "123456",
    confirmPass : "123456",
};

describe("e2e tests", () => {
    beforeAll(async () => {
        browser = await chromium.launch();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        context = await browser.newContext();
        page = await context.newPage();
    });

    afterEach(async () => {
        await page.close();
        await context.close();
    });

    
    describe("authentication", () => {
        
        test("Register with valid data", async () => {
            await page.goto(host);
            await page.locator('a[href="/register"]').first().click();

            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);

            user.username = `Auto_Test_User${random}`;
            user.email = `abv_${random}@test.bg`;

            await page.locator('#username').fill(user.username);
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.locator('#repeatPass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('input[type="submit"]')
            ]); 

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            console.log(userData);
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test("Login with valid data", async () => {
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() === 200),
                page.click('input[type="submit"]')
            ]); 

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            console.log(userData);
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test("Logout from the application", async () => {
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('input[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() === 204),
                page.locator('a[href="/logout"]').click()
            ]); 

            expect(response.ok()).toBeTruthy();
            
            await page.locator('a[href="/login"]');

            await page.waitForURL(host + '/');
            expect(page.url()).toBe(host + '/');
        });
    });


    describe("navbar", () => {
        test("Logged user Navbar", async () => {
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('input[type="submit"]');

            await expect(page.locator('a[href="/catalog"]').first()).toBeVisible();
            await expect(page.locator('a[href="/create"]').first()).toBeVisible();
            await expect(page.locator('a[href="/myprofile"]').first()).toBeVisible();
            await expect(page.locator('a[href="/logout"]').first()).toBeVisible();

            await expect(page.locator('a[href="/login"]').first()).toBeHidden();
            await expect(page.locator('a[href="/register"]').first()).toBeHidden();
            
        });

        test("Guest user Navbar", async () => {
            await page.goto(host);
            await expect(page.locator('a[href="/login"]').first()).toBeVisible();
            await expect(page.locator('a[href="/register"]').first()).toBeVisible();
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/"]')).toBeVisible();

            await expect(page.locator('a[href="/create"]').first()).toBeHidden();
            await expect(page.locator('a[href="/myprofile"]').first()).toBeHidden();
            await expect(page.locator('a[href="/logout"]').first()).toBeHidden();
        });
        
    });

    describe("CRUD", () => {
        beforeEach( async () => {
            await page.goto(host);
            await page.locator('a[href="/login"]').first().click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('input[type="submit"]');
        });

        test('Create meme', async () => {
            await page.click('a[href="/create"]');
            await page.waitForSelector('form');

            await page.fill('[name="title"]', 'Test Meme');
            await page.fill('[name="description"]', 'Test Description');
            await page.fill('[name="imageUrl"]', 'image/2.png');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);

            expect(response.ok()).toBeTruthy();
            let memeData = await response.json();
            console.log(memeData);
            expect(memeData.title).toBe('Test Meme');
            expect(memeData.description).toBe('Test Description');
            expect(memeData.imageUrl).toBe('image/2.png');
        });

        test('Edit meme', async () => {

            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();
            await page.locator('//a[text()="Edit"]').first().click();

            await page.waitForSelector('form');
            await page.fill('[name="title"]', 'Edited Meme');
            await page.fill('[name="description"]', 'Edited Description');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('input[type="submit"]')
            ]);

            expect(response.ok()).toBeTruthy();
            let memeData = await response.json();
            console.log(memeData);
            expect(memeData.title).toBe('Edited Meme');
            expect(memeData.description).toBe('Edited Description');
            expect(memeData.imageUrl).toBe('image/2.png');
        });

        test('Delete meme', async () => {

            await page.click('a[href="/myprofile"]');
            await page.locator('//a[text()="Details"]').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/memes') && response.status() === 200),
                page.click('//button[text()="Delete"]')
            ]);

            expect(response.ok()).toBeTruthy();
        });
        
    });
});