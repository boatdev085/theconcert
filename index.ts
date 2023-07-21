// Import puppeteer
import axios from 'axios';
import puppeteer from 'puppeteer';

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  // Launch the browser
  console.log('start');

  //   const response = await axios.post(
  //     'https://www.theconcert.com/rest/users/login',
  //     {
  //       username: 'frontenddefi888@gmail.com',
  //       password: 'P@ssword123',
  //       lang: 'th',
  //       device_id: 'lkbekivi',
  //       device_type: 'web',
  //       type: 'email',
  //     }
  //   );
  //   // .then(async (t) => await t.json())
  //   // .catch((e) => undefined);

  //   const accessToken = response?.data?.response?.access_token;
  //   console.log('response', accessToken);
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [`--window-size=1920,1080`],
    defaultViewport: {
      width: 1920,
      height: 1080,
    },
  });
  //   // Create a page
  const page = await browser.newPage();

  //   // Go to your site
  await page.goto(`https://www.theconcert.com/concert/2427`);

  // Query for an element handle.
  const btnReserve = await page.waitForSelector('.btn-reserve');

  // Do something with element...
  console.log('btnReserve: ', btnReserve);
  if (btnReserve) {
    await btnReserve.click(); // Just an example.
    await btnReserve.dispose();
    // Dispose of handle
  }
  await delay(500);

  const menuLogin = await page.waitForSelector(
    '.login-box > ul > li:nth-child(2)'
  );
  console.log('menuLogin: ', menuLogin);
  if (menuLogin) {
    await menuLogin.click();
  }

  await page.waitForSelector('#email-login');
  await page.focus('#email-login');
  await page.keyboard.type('frontenddefi888@gmail.com', { delay: 10 });

  await page.waitForSelector('#password-field-email');
  await page.focus('#password-field-email');
  await page.keyboard.type('P@ssword123', { delay: 10 });
  const btnLogin = await page.waitForSelector('#login_email_btn');
  await delay(1000);
  //   await page.setRequestInterception(true);

  await btnLogin?.click();
  const getAccessToken = await new Promise((resolve) => {
    page.on('response', async (response) => {
      const request = response.request();
      if (request.url().includes('www.theconcert.com/rest/users/login')) {
        const responseLogin = await response.json();
        resolve(responseLogin?.response?.access_token);
      }
    });
  });

  //   console.log('getAccessToken', getAccessToken);
  const page2 = await browser.newPage();

  //   // Go to your site
  await page2.goto(
    `https://www.theconcert.com/concert/2427/stage?queue=${getAccessToken}`
  );

  let getZoneBuy = await page2.waitForSelector(
    '#zone-box > ul > li:nth-child(5)'
  );
  console.log('getZoneBuy: ', getZoneBuy);
  if (getZoneBuy) {
    await getZoneBuy.click();
  }
  await delay(1000);
  let getChair = await page2.waitForSelector(
    '#wrap > svg > image:nth-child(1)'
  );
  console.log('getChair: ', getChair);
  if (getChair) {
    await getChair.click();
  }

  await delay(100);

  let getBtnSubmit = await page2.waitForSelector(
    '#select-variant > div.box-placeorder > div.button-f > button'
  );
  console.log('getBtnSubmit: ', getBtnSubmit);
  //
  if (getBtnSubmit) {
    await getBtnSubmit.click();
  }
  //   await page2.evaluate(() => {
  //     const zoneList = document.querySelectorAll('#zone-box > ul > li');
  //     console.log('zoneList: ', zoneList);
  //   });
  console.log('close');
  //   await browser.close();
})();
