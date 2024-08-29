const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require('@playwright/test');
const { chromium } = require('playwright');

const host = 'http://localhost:3001'; // Application host (NOT service host - that can be anything)

let browser;
let context;
let page;

let user = {
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
        test("register user", async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 10000);
            user.email = `email${random}@abv.bg`;

            //act
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.locator("#repeat-pass").fill(user.confirmPass);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/register") && response.status() == 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });
       
        test("login user", async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            //act
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/login") && response.status() == 200),
                page.click('[type="submit"]')
            ]);
            let userData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test("logout user", async () => {
            //arrange
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');

            //act
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');

            //act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/users/logout") && response.status() == 204 ),
                page.locator('text=Logout').click()
            ]);

            //assert
            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('text=Login');
            expect(page.url()).toBe(host + "/");
        });
    });

    describe("navbar", () => {
        test("Navbar for logged user", async () => {
            //arrange
            await page.goto(host);
            //act
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');

            //assert
            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=My Books')).toBeVisible();
            await expect(page.locator('nav >> text=Add book')).toBeVisible();
            await expect(page.locator('nav >> text=Logout')).toBeVisible();
        });

        test("Navbar for guest user", async () => {
            //arrange
            await page.goto(host);
            //act
            //assert
            await expect(page.locator('nav >> text=Dashboard')).toBeVisible();
            await expect(page.locator('nav >> text=Login')).toBeVisible();
            await expect(page.locator('nav >> text=Register')).toBeVisible();
            await expect(page.locator('nav >> text=My Books')).toBeHidden();
            await expect(page.locator('nav >> text=Add book')).toBeHidden();
            await expect(page.locator('nav >> text=Logout')).toBeHidden();
        });
        
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.click('text=Login');
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');
        });

        test('add book', async () => {
            //arrange
            await page.click('text=Add book');
            await page.waitForSelector('form');

            //act
            await page.fill('[name="title"]', 'Test title');
            await page.fill('[name="description"]', 'Test description');
            await page.fill('[name="imageUrl"]', '/images/book.jpg');
            await page.locator("#type").selectOption('Fiction');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/books") && response.status() == 200),
                page.click('[type="submit"]')
            ]);

            let bookData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(bookData.title).toEqual('Test title');
            expect(bookData.description).toEqual('Test description');
            expect(bookData.imageUrl).toEqual('/images/book.jpg');
            expect(bookData.type).toEqual('Fiction');

        });

        test('edit book', async () => {
            //arrange
            await page.click('text=My Books');
            await page.locator('text=Details').first().click();
            await page.locator('text=Edit').first().click();
            await page.waitForSelector('form');

            //act
            await page.fill('[name="title"]', 'Edited title');
            await page.fill('[name="description"]', 'Edited description');
            await page.fill('[name="imageUrl"]', '/images/book.jpg');
            await page.locator("#type").selectOption('Fiction');

            //assert
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/books") && response.status() == 200),
                page.click('[type="submit"]')
            ]);

            let bookData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
            expect(bookData.title).toEqual('Edited title');
            expect(bookData.description).toEqual('Edited description');
            expect(bookData.imageUrl).toEqual('/images/book.jpg');
            expect(bookData.type).toEqual('Fiction');
        });

        test('delete book', async () => {
            //arrange
            await page.click('text=My Books');
            await page.locator('text=Details').first().click();

            //act
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/books") && response.status() == 200),
                page.click('text=Delete')
            ]);

            let bookData = await response.json();

            //assert
            expect(response.ok()).toBeTruthy();
        });
    });
});