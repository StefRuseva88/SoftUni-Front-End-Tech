const { test, describe, beforeEach, afterEach, beforeAll, afterAll, expect } = require ('@playwright/test');
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

let albumName = "";

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
            await page.click('text=Register');
            await page.waitForSelector('form');
            
            let random = Math.floor(Math.random() * 10000);

            user.email = `abv${random}@test.bg`;
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.locator('#conf-pass').fill(user.confirmPass);

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('[type="submit"]')
            ]); 

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            console.log(userData);
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        test('Login with valid data', async () => {

            await page.goto(host);
            await page.locator('text=Login').click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() === 200),
                page.click('[type="submit"]')
            ]); 

            expect(response.ok()).toBeTruthy();
            let userData = await response.json();
            console.log(userData);
            expect(userData.email).toBe(user.email);
            expect(userData.password).toBe(user.password);
        });

        
        test('Logout from the application', async () => {
            await page.goto(host);
            await page.locator('text=Login').click();
            await page.waitForSelector('form');
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('[type="submit"]');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() === 204),
                page.locator('text=Logout').click()
            ]); 

            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('text=Login');
            expect(page.url()).toBe(host + '/');
        });
        
    });

    describe("navbar", () => {
        test('Logged user navbar', async () => {
            await page.goto(host);
            await page.locator('text=Login').click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('[type="submit"]');

            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/search"]')).toBeVisible();
            await expect(page.locator('a[href="/create"]')).toBeVisible();
            await expect(page.locator('a[href="/logout"]')).toBeVisible();

            await expect(page.locator('a[href="/login"]')).toBeHidden();
            await expect(page.locator('a[href="/register"]')).toBeHidden();
        });

        test('Guest user navbar', async () => {
            
            await page.goto(host);
            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/catalog"]')).toBeVisible();
            await expect(page.locator('a[href="/search"]')).toBeVisible();
            await expect(page.locator('a[href="/login"]')).toBeVisible();
            await expect(page.locator('a[href="/register"]')).toBeVisible();

            await expect(page.locator('a[href="/create"]')).toBeHidden();
            await expect(page.locator('a[href="/logout"]')).toBeHidden();
        });
        
    });

    describe("CRUD", () => {
        beforeEach(async () => {
            await page.goto(host);
            await page.locator('text=Login').click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('[type="submit"]');
        })

        test('Create album', async () => {
            await page.click('nav >> text=Create Album');
            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 1000);
            albumName = `New Album ${random}`;

            await page.fill('#name', albumName);
            await page.fill('#imgUrl', '/images/2.jpg');
            await page.fill('#price', '22.22');
            await page.fill('#releaseDate', '2022-12-12');
            await page.fill('#artist', 'Test Artist');
            await page.fill('#genre', 'Rock');
            await page.fill('textarea[name="description"]', 'Test Description');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/albums') && response.status() === 200),
                page.click('[type="submit"]')
            ])

            let albumData = await response.json();
            expect(response.ok()).toBeTruthy();
            expect(albumData.name).toBe(albumName);
            expect(albumData.imgUrl).toBe('/images/2.jpg');
            expect(albumData.price).toBe('22.22');
            expect(albumData.releaseDate).toBe('2022-12-12');
            expect(albumData.artist).toBe('Test Artist');
            expect(albumData.genre).toBe('Rock');
            expect(albumData.description).toBe('Test Description');
        });

        test('Edit album', async () => {

            await page.click('text=Search');
            await page.fill('#search-input', albumName);
            await page.click('.button-list >> text=Search');
            await page.locator('text=Details').first().click();
            await page.locator('text=Edit').click();
            await page.waitForSelector('form');

            await page.fill('#name', 'Random_Edited_Name');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/albums') && response.status() === 200),
                page.click('[type="submit"]')
            ]);

           let albumData = await response.json();
           console.log(albumData);

            expect(response.ok()).toBeTruthy();
            expect(albumData.name).toBe('Random_Edited_Name');
            expect(albumData.imgUrl).toBe('/images/2.jpg');
            expect(albumData.price).toBe('22.22');
            expect(albumData.releaseDate).toBe('2022-12-12');
            expect(albumData.artist).toBe('Test Artist');
            expect(albumData.genre).toBe('Rock');
            expect(albumData.description).toBe('Test Description');
        });

        test('Delete album', async () => {
            await page.click('text=Search');
            
            await page.fill('#search-input', "Random_Edited_Name");
            await page.click('.button-list >> text=Search');

            await page.locator('text=Details').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/albums') && response.status() === 200),
                page.locator('text=Delete').click(),
                page.on('dialog', dialog => dialog.accept()),
            ]);

            expect(response.ok()).toBeTruthy();
        });
    });
});