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

let pet = {
    age : "2 years",
    name : "",
    breed : "Random breed",
    image : "/images/cat-create.jpg",
    weight  : "2 kg"
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
        test("register makes correct API call", async () => {
            await page.goto(host);
            await page.click('text=Register');

            await page.waitForSelector('form');

            let random = Math.floor(Math.random() * 1000);

            user.email = `abv_${random}@abv.bg`;

            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.locator("#repeatPassword").fill(user.confirmPass);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/register') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            
            await expect(response.ok()).toBeTruthy();
            let userData = await response.json();

            expect(userData.email).toBe(user.email);
            expect(userData.password).toEqual(user.password);
        });

        test("login makes correct API call", async () => {
            await page.goto(host);
            await page.click('text=Login');

            await page.waitForSelector('form');

            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/login') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            
            expect(response.ok()).toBeTruthy();
            let userData = await response.json();

            expect(userData.email).toBe(user.email);
            expect(userData.password).toEqual(user.password);
        });

        test("logout makes correct API call", async () => {
            await page.goto(host);
            await page.click('text=Login');

            await page.waitForSelector('form');

            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');

            await page.waitForSelector('text=Logout');
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/users/logout') && response.status() === 204),
                page.click('text=Logout')
            ]);
            
            expect(response.ok()).toBeTruthy();
            await page.waitForSelector('text=Login');
            expect(page.url()).toBe(host + '/');
        });
    })

    describe("navbar", () => {
        test("navigation for logged-in user", async () => {
            await page.goto(host);
            await page.click('text=Login');
        
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');
        
            await page.waitForSelector('text=Logout');
            
            await expect(page.locator('text=Home')).toBeVisible();
            await expect(page.locator('text=Dashboard')).toBeVisible();
            await expect(page.locator('text=Create Postcard')).toBeVisible();
            await expect(page.locator('text=Logout')).toBeVisible();
        
            await expect(page.locator('text=Login')).toBeHidden();
            await expect(page.locator('text=Register')).toBeHidden();
        });
        
        test("navigation for guest user", async () => {
            await page.goto(host);
            
            await expect(page.locator('text=Home')).toBeVisible();
            await expect(page.locator('text=Dashboard')).toBeVisible();
            await expect(page.locator('text=Login')).toBeVisible();
            await expect(page.locator('text=Register')).toBeVisible();
        
            await expect(page.locator('text=Create Postcard')).toBeHidden();
            await expect(page.locator('text=Logout')).toBeHidden();
        });
        
    });

    describe("CRUD", () => {
        test("create postcard", async () => {
            await page.goto(host);
            await page.click('text=Login');
        
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');
        
            await page.waitForSelector('text=Create Postcard');
            await page.click('text=Create Postcard');
        
            await page.waitForSelector('form');
        
            let random = Math.floor(Math.random() * 1000);
            pet.name = `Pet_${random}`;
        
            await page.locator("#name").fill(pet.name);
            await page.locator("#age").fill(pet.age);
            await page.locator("#breed").fill(pet.breed);
            await page.locator("#weight").fill(pet.weight);
            await page.locator("#image").fill(pet.image);
        
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/pets') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            
            expect(response.ok()).toBeTruthy();
            let petData = await response.json();
        
            expect(petData.name).toBe(pet.name);
            expect(petData.age).toBe(pet.age);
            expect(petData.breed).toBe(pet.breed);
            expect(petData.weight).toBe(pet.weight);
            expect(petData.image).toBe(pet.image);
        });
        
        test("edit postcard", async () => {
            await page.goto(host);
            await page.click('text=Login');
        
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');
        
            await page.click('text=Dashboard');
            await page.click('text=Details'); // Click the first postcard's detail button
        
            await page.waitForSelector('text=Edit');
            await page.click('text=Edit');
        
            await page.waitForSelector('form');
        
            pet.name = `Edited_Pet_${Math.floor(Math.random() * 1000)}`;
            await page.locator("#name").fill(pet.name);
        
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/pets') && response.status() === 200),
                page.click('[type="submit"]')
            ]);
            
            expect(response.ok()).toBeTruthy();
            let petData = await response.json();
        
            expect(petData.name).toBe(pet.name);
            expect(petData.age).toBe(pet.age);
            expect(petData.breed).toBe(pet.breed);
            expect(petData.weight).toBe(pet.weight);
            expect(petData.image).toBe(pet.image);
        });
        
        test("delete postcard", async () => {
            await page.goto(host);
            await page.click('text=Login');
        
            await page.waitForSelector('form');
            await page.locator("#email").fill(user.email);
            await page.locator("#password").fill(user.password);
            await page.click('[type="submit"]');
        
            await page.click('text=Dashboard');
            await page.click('text=Details'); // Click the first postcard's detail button
        
            let [response] = await Promise.all([
                page.waitForResponse(response => response.url().includes('/data/pets') && response.status() === 200),
                page.click('text=Delete'),
                page.on('dialog', dialog => dialog.accept())
            ]);
            
            expect(response.ok()).toBeTruthy();
        });
        
    })
})