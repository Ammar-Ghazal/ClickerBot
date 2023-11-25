const { test, expect } = require('@playwright/test');
import { writeExternal } from './v2dataseeding.spec';
import * as fs from 'fs';

// Global variables
export const stockInfoDirectory: string = "./stock_information.txt";
test.setTimeout(18000000);
let firstTime: boolean = true;
let foundURLS = [];
let pageTimeout = 3000;

// Playwright test loop
test('fragranceBuyStockCheckerV2', async ({ page }) => {
  // navigate to wish list:
  const itemsArray = buildMergedList(stockInfoDirectory);
  // while(true){
  for (let i = 0; i < itemsArray.length; i++) {
    const item = itemsArray[i];
    console.log(item);
    if (item.stockStatus == 'Add to Cart') {
        await notifyByEmail(item.itemName, page);
        itemsArray.splice(i, 1);
        i--; // Decrement i to account for the removed item
    } else if (item.stockStatus == 'Out of stock') {
        // Do nothing for now
    } else {
        notifyByEmail('Checker broken :(', page);
    }
  }

  // Update the text file:
  writeExternal(itemsArray);

  // await page.getByRole('cell', { name: 'The Woods Collection Natural Dusk For Man/Woman - The Woods Collection Natural Dusk EDP M 100ml Boxed' }).click();
  // await page.locator('#registry-variant-40089878134846').getByRole('cell', { name: 'Out of stock' }).click();
});


// ************************************************************************
// *************************** HELPER FUNCTIONS ***************************
// ************************************************************************
function buildMergedList(fileName: string): { itemName: string; stockStatus: string }[] {
  const data: { itemName: string; stockStatus: string }[] = [];

  try {
      const fileContent = fs.readFileSync(fileName, 'utf-8');
      const lines = fileContent.split('\n');

      lines.forEach(line => {
          const [itemPart, statusPart] = line.split(', ');
          const itemName = itemPart.split(': ')[1];
          const stockStatus = statusPart.split(': ')[1];
          data.push({ itemName: itemName.trim(), stockStatus: stockStatus.trim() });
      });

      return data;
  } catch (error) {
      console.error('Error reading file:', error);
      return [];
  }
}

// Function to send notification email if the product is in stock.
async function notifyByEmail(name, page) {
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
  await page.getByPlaceholder('Subject').fill(`${name} is in stock`);
  await page.getByRole('textbox', { name: 'Message Body' }).click();
  await page.getByRole('textbox', { name: 'Message Body' }).fill(`This product is in stock: ${name}\n`);
  await page.getByLabel('Send ‪(Ctrl-Enter)‬').click();
  await expect(page.getByText('Message sent')).toHaveCount(1);
};
