const { test, expect } = require('@playwright/test');
import { stockInfoDirectory } from './test-v2.spec';

// Playwright test loop
test('fragranceBuyStockCheckerV2DataSeeding', async ({ page }) => {
    // navigate to wish list:
    await page.goto('https://fragrancebuy.ca/apps/giftregistry/wishlist/721499?_r=1&utm_source=gift_reggie&utm_medium=gift_reggie&utm_campaign=gift_reggie&utm_content=721499');
    
    // Extract all stock statuses:
    const allStockStatuses = await page.$$('td.gr-oos-btn, td.gr-atc-btn');
    let numItems = 0;
    for (const stockStatus of allStockStatuses) {
      const textContent = await stockStatus.textContent();
      console.log(textContent);
      numItems++;
    }
    console.log(numItems);
    
    // Extract all item names:
    numItems = 0;
    const allItemNames = await page.$$('td[style="text-align:center;"]');
    for (const itemName of allItemNames) {
      const textContent = await itemName.textContent();
      console.log(textContent); // Print the text content of each itemName (trimmed)
      numItems++;
    }
    console.log(numItems);

    // Store both into one nice list:
    expect(allStockStatuses.length).toBe(allItemNames.length);
    const mergedLength = allStockStatuses.length;
    const mergedList = [];
    for (let i = 0; i < mergedLength; i++){
      const itemName = ((await allItemNames[i].textContent()).split('-')[0]).split(' For ')[0];
      const stockStatus = await allStockStatuses[i].textContent();
      mergedList.push({itemName: itemName, stockStatus: stockStatus});
    }

    // Store all information in an external text file:
    writeExternal(mergedList);
});

export function writeExternal(mergedList: Array<Object>){
  const fs = require('fs');
  const fileContent = mergedList.map(item => `Item: ${item.itemName}, Stock Status: ${item.stockStatus}`).join('\n');
  fs.writeFile(stockInfoDirectory, fileContent, (err) => {
      if (err) {
          console.error('Error writing to file:', err);
      } else {
          console.log(`Stock information has been saved to ${stockInfoDirectory}`);
      }
  });
}