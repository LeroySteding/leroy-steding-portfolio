#!/usr/bin/env tsx
import puppeteer from "puppeteer";

async function debugAPI() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  const apiCalls: any[] = [];

  // Intercept network requests
  page.on('response', async (response) => {
    const url = response.url();
    
    // Look for API calls
    if (url.includes('api') || url.includes('json') || url.includes('opdracht')) {
      const contentType = response.headers()['content-type'] || '';
      
      if (contentType.includes('json')) {
        try {
          const data = await response.json();
          apiCalls.push({
            url,
            status: response.status(),
            data: data,
          });
          
          console.log(`\n📡 API Call: ${url}`);
          console.log(`Status: ${response.status()}`);
          
          // Check if this contains job/assignment data
          const dataStr = JSON.stringify(data);
          if (dataStr.includes('opdracht') || dataStr.includes('assignment')) {
            console.log("✅ Found job data!");
            console.log("Sample:", JSON.stringify(data).substring(0, 500));
          }
        } catch (e) {
          // Not JSON
        }
      }
    }
  });
  
  await page.goto("https://www.freep.nl/opdrachten", {
    waitUntil: "networkidle2",
  });

  await new Promise(resolve => setTimeout(resolve, 5000));

  console.log(`\n📊 Total API calls captured: ${apiCalls.length}`);
  
  await browser.close();
}

debugAPI().catch(console.error);
