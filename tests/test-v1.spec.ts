const { test, expect } = require('@playwright/test');
const nodemailer = require('nodemailer');

// Global variables
test.setTimeout(18000000);
let fragranceName;
let firstTime: boolean = true;
let foundURLS = [];
let pageTimeout = 3000;

// Define an array of URLs to check.
const productURLs = [
  'https://fragrancebuy.ca/products/sapilbound-man',
  'https://fragrancebuy.ca/products/lattafathetux-man',
  // 'https://fragrancebuy.ca/products/azzaromostwanted-man',
  'https://fragrancebuy.ca/products/armanicodeprofumo-man',
  // 'https://fragrancebuy.ca/products/bvlgarimaninblack-man',
  'https://fragrancebuy.ca/products/lattafakhamrahqahwa-man',
  // 'https://fragrancebuy.ca/products/lattafaqaedalfursan-man',
  // 'https://fragrancebuy.ca/products/fragranceworldspectreghost-man',
  'https://fragrancebuy.ca/products/isseymiyakepulseofthenight-man',
  // 'https://fragrancebuy.ca/products/thewoodscollectionnaturaldusk-man',
  'https://fragrancebuy.ca/products/fragranceworldanaqeedgreenathoor-man',
  // 'https://fragrancebuy.ca/products/moresquethesecretcollectionsoulbatik-man',
  // 'https://fragrancebuy.ca/products/fragranceworldmarkviktoreaudespiceextreme-man',
  // 'https://fragrancebuy.ca/products/armafjustjacknoirendurancenoirextremetwist-man',
  'https://fragrancebuy.ca/products/fragranceworldmoonlightlailaiqamarluminoustwist-man',
];

// Playwright test loop
test('fragranceBuyStockCheckerV1', async ({ page }) => {
  // Continuous loop to check stock status for all URLs.
  while (true) {
    for (const url of productURLs) {
      // fragranceName = await page.locator('.heading_tres').textContent();
      // console.log(`fragrance name is ${fragranceName}\n`)
      await checkNotify(url, page);
      await page.waitForTimeout(pageTimeout);
    }

    for (const item of foundURLS) {
      const indexToRemove = productURLs.indexOf(item);
      if (indexToRemove !== -1) {
        productURLs.splice(indexToRemove, 1);
      }
    }
  }
});

// Test function to check stock and send notification if in stock.
async function checkNotify(url, page) {
  // (Your inStock function logic here)

  if (await inStock(url, page)) {
    // const fragranceName = await page.textContent('.accent.heading_tres');
    fragranceName = await page.locator('.heading_tres').textContent();
    await notifyByEmail(url, page);
    
    //mark URL here
    foundURLS.push(url);
  }
}

// ************************************************************************
// *************************** HELPER FUNCTIONS ***************************
// ************************************************************************

// Function to send notification email if the product is in stock.
async function notifyByEmail(url, page) {
  await page.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=AYZoVhdt5ZqDvBjaloNqdNZ1F3jwLd5tOyPGdDkrAyTfSLTgmPfp-TgOqlGpIlNmQa2OEGlslFG2Jw&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S2114331609%3A1694737532932732&theme=glif');

  // Log into email account:
  if(firstTime){
    firstTime = false;
    // // Email account #1:
    // await page.getByLabel('Email or phone').fill('cuckhole98@gmail.com');
    // await page.getByLabel('Email or phone').press('Enter');
    // await page.getByLabel('Enter your password').click();
    // await page.getByLabel('Enter your password').fill('3g3rvg4ebhqfhui2e3jhyebgrvf@!#b');
    // await page.getByRole('button', { name: 'Next' }).click();

    // Email account #2:
    await page.getByLabel('Email or phone').fill('soccerlolface@gmail.com');
    await page.getByLabel('Email or phone').press('Enter');
    await page.getByLabel('Enter your password').click();
    await page.getByLabel('Enter your password').fill('Ag274766469');
    await page.getByRole('button', { name: 'Next' }).click();
  }
 
  // Compose and send email:
  await page.getByRole('button', { name: 'Compose' }).click();
  await page.getByRole('combobox').click();
  await page.getByRole('combobox').fill('soccerlolface@gmail.com');
  await page.getByRole('option', { name: 'Anonymous Goose soccerlolface@gmail.com' }).locator('b').click();
  await page.getByPlaceholder('Subject').click();
  await page.getByPlaceholder('Subject').fill(`${fragranceName} is in stock`);
  await page.getByRole('textbox', { name: 'Message Body' }).click();
  await page.getByRole('textbox', { name: 'Message Body' }).fill(`This product is in stock: ${url}\n`);
  await page.getByLabel('Send ‪(Ctrl-Enter)‬').click();
  await expect(page.getByText('Message sent')).toHaveCount(1);
};

// Function to check if the product is in stock.
async function inStock(url, page) {
  // Navigate to the specified URL.
  await page.goto(url);

  // Check if the page contains 'Sold Out'.
  const soldOutElement = await page.$('text=Sold Out');
  
  // Return true if 'Sold Out' is not found, indicating the product is in stock.
  return !soldOutElement;
}