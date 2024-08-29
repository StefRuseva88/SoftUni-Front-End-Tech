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

        test("Register with valid data", async () => {

            await page.goto(host);
            await page.click('text=Register');
            await page.waitForSelector('form');
            
            let random = Math.floor(Math.random() * 10000);

            user.email = `abv${random}@test.bg`;
            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.locator('#repeatPassword').fill(user.confirmPass);

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

        test("Login with valid data", async () => {
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

        test("Logout from the Application", async () => {
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
        test("Logged user Navbar", async () => {
            await page.goto(host);
            await page.locator('text=Login').click();

            await page.waitForSelector('form');

            await page.locator('#email').fill(user.email);
            await page.locator('#password').fill(user.password); 
            await page.click('[type="submit"]');

            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/create"]')).toBeVisible();
            await expect(page.locator('a[href="/profile"]')).toBeVisible();
            await expect(page.locator('a[href="/logout"]')).toBeVisible();

            await expect(page.locator('a[href="/login"]')).toBeHidden();
            await expect(page.locator('a[href="/register"]')).toBeHidden();
        });

        test("Guest user Navbar", async () => {
            await page.goto(host);
            await expect(page.locator('a[href="/"]')).toBeVisible();
            await expect(page.locator('a[href="/login"]')).toBeVisible();
            await expect(page.locator('a[href="/register"]')).toBeVisible();

            await expect(page.locator('a[href="/create"]')).toBeHidden();
            await expect(page.locator('a[href="/profile"]')).toBeHidden();
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

        test("Create event", async () => {
            await page.click('nav >> text=Create Event');
            await page.waitForSelector('form');

            await page.fill('#title', 'Test Event');
            await page.fill('#description', 'Test Description');
            await page.fill('#imageUrl', '/images/Moulin-Rouge!-The-Musical.jpg');
            await page.fill('#date', '2022-12-12');
            await page.fill('#author', 'Test Author');

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/theaters') && response.status() === 200),
                page.click('[type="submit"]')
            ])

            let eventData = await response.json();
            expect(response.ok()).toBeTruthy();
            expect(eventData.title).toBe('Test Event');
            expect(eventData.description).toBe('Test Description');
            expect(eventData.imageUrl).toBe('/images/Moulin-Rouge!-The-Musical.jpg');
            expect(eventData.date).toBe('2022-12-12');
            expect(eventData.author).toBe('Test Author');
        });

        test("Edit event", async () => {
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();
            await page.click('text=Edit');
            await page.waitForSelector('form');

            await page.fill('#title', 'Random edited_title');
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/theaters') && response.status() == 200 ),
                page.click('[type="submit"]')
            ]);
            let eventData = await response.json();
            console.log(eventData);

            expect(response.ok()).toBeTruthy();
            expect(eventData.title).toEqual('Random edited_title');
            expect(eventData.author).toEqual('Test Author');
            expect(eventData.date).toEqual('2022-12-12');
            expect(eventData.description).toEqual('Test Description');
            expect(eventData.imageUrl).toEqual("/images/Moulin-Rouge!-The-Musical.jpg");

        });

        test("Delete event", async()=>{
            
            await page.click('nav >> text=Profile');
            await page.locator('text=Details').first().click();

            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes("/data/theaters") && response.status() == 200 ),
                page.on('dialog', dialog => dialog.accept()),
                page.click('text=Delete')
            ]);

            expect(response.ok()).toBeTruthy();
        })
    
    });
});