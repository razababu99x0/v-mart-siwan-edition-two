const { chromium } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const context=await browser.newContext({viewport:{width:1440,height:1000}});
 const page=await context.newPage();const report={};
 async function audit(name){await page.waitForTimeout(600);const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();report[name]=result.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary,html:n.html}))}));console.log(name,JSON.stringify(report[name],null,2));}
 for(const route of ['/', '/product/relaxed-linen-shirt']){
  await page.goto(`http://localhost:3000${route}`,{waitUntil:'domcontentloaded'});await page.waitForTimeout(900);
  const height=await page.evaluate(()=>document.documentElement.scrollHeight);
  for(let y=0;y<height;y+=750){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(160);}
  await audit(route);
 }
 await context.request.post('http://localhost:3000/api/shop',{data:{action:'add',productId:'textured-tee',size:'L',color:'Forest',quantity:1}});
 await page.goto('http://localhost:3000/checkout',{waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);await audit('/checkout');
 await page.getByLabel('Full name',{exact:true}).fill('Accessibility Demo');await page.getByLabel('Email address',{exact:true}).fill('accessibility@example.test');await page.getByLabel('Mobile number',{exact:true}).fill('9876543210');await page.getByLabel('Your delivery address',{exact:true}).fill('12 Example Lane, Demo Locality');await page.getByLabel('PIN code',{exact:true}).fill('841226');await page.getByRole('button',{name:'Continue to delivery',exact:true}).click();await audit('checkout-delivery');await page.getByRole('button',{name:'Continue to payment',exact:true}).click();await audit('checkout-payment');await page.locator('.payment-tabs').getByRole('button',{name:'Netbanking',exact:true}).click();await audit('checkout-netbanking');
 await page.getByRole('button',{name:'Search products',exact:true}).click();await audit('search-dialog');await page.keyboard.press('Escape');await page.waitForTimeout(500);
 await page.getByRole('button',{name:/Open shopping bag/}).click();await audit('cart-drawer');
 fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/accessibility.json',JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
