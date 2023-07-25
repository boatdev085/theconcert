// Import puppeteer
import axios from 'axios';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

function delay(time: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

(async () => {
  // Launch the browser

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
  // const cookies = fs.readFileSync('cookies.json', 'utf8');
  // if (cookies) {
  //   const deserializedCookies = JSON.parse(cookies);
  //   await page.setCookie(...deserializedCookies);
  // }

  // console.log('cookies: ', cookies);

  //   // Go to your site
  await page.goto(`https://www.theconcert.com/`);
  // Query for an element handle.

  // const localStorageFile = fs.readFileSync('localstorage.json', 'utf8');

  // const deserializedStorage = JSON.parse(localStorageFile);
  // console.log('deserializedStorage: ', deserializedStorage);
  // await page.evaluate((deserializedStorage) => {
  //   for (const key in deserializedStorage) {
  //     localStorage.setItem(key, deserializedStorage[key]);
  //   }
  // }, deserializedStorage);
  await delay(1500);
  await page.waitForSelector('#popup-modal');
  const btnBeforeLogin = await page.waitForSelector(
    '#shortcut_bar > div > div > div.short-profile.cursor-pointer.d-none.d-md-block'
  );
  if (btnBeforeLogin) {
    await page.$eval(
      '#shortcut_bar > div > div > div.short-profile.cursor-pointer.d-none.d-md-block',
      (elm) => elm.click()
    );
  }
  await delay(1000);

  await page.waitForSelector('#_login');
  await page.focus('#_login');
  await page.keyboard.type(process.env.USERNAME || '', { delay: 10 });

  await page.waitForSelector('#password-field');
  await page.focus('#password-field');
  await page.keyboard.type(process.env.PASSWORD || '', { delay: 10 });
  await page.waitForSelector('#login_btn');
  await page.$eval('#login_btn', (elm: any) => elm.click());

  // console.log('process.env: ', process.env);
  // await page.waitForSelector('#email-login');
  // await page.focus('#email-login');
  // await page.keyboard.type(process.env.USERNAME || '', { delay: 10 });

  // await page.waitForSelector('#password-field-email');
  // await page.focus('#password-field-email');
  // await page.keyboard.type(process.env.PASSWORD || '', { delay: 10 });
  // const btnLogin = await page.waitForSelector('#login_email_btn');
  // await delay(1000);
  // //   await page.setRequestInterception(true);

  // await btnLogin?.click();
  const getAccessToken = await new Promise((resolve) => {
    page.on('response', async (response) => {
      const request = response.request();
      if (request.url().includes('www.theconcert.com/rest/users/login')) {
        const responseLogin = await response.json();
        resolve(responseLogin?.response?.access_token);
      }
    });
  });
  // if (getAccessToken) {
  //   const cookies = await page.cookies();
  //   const cookieJson = JSON.stringify(cookies);
  //   fs.writeFileSync('cookies.json', cookieJson);
  //   const localStorage = await page.evaluate(() =>
  //     JSON.stringify(window.localStorage)
  //   );
  //   fs.writeFileSync('localstorage.json', localStorage);
  // }

  // // fs.writeFileSync('cookies.json', cookieJson);
  // //   console.log('getAccessToken', getAccessToken);
  // if (!getAccessToken) {
  //   console.log('login fail');
  //   return;
  // }
  const page2 = await browser.newPage();

  // //   // Go to your site
  await page2.goto(
    `https://www.theconcert.com/concert/${process.env.ID_CONCERT}/stage?queue=${getAccessToken}`
  );

  const getList = await axios.get(
    `https://api.theconcert.com/v3/products/${process.env.ID_CONCERT}/variants?limit=10&page=1`
  );
  if (getList?.data?.data && getList?.data?.data?.record?.length > 0) {
    for (let i = 0; i < getList?.data?.data?.record?.length; i++) {
      if (
        !getList?.data?.data?.record[i]?.display_text
          ?.toLowerCase()
          ?.includes('sold')
      ) {
        let getZoneBuy = await page2.waitForSelector(
          `#zone-box > ul > li:nth-child(${i + 1})`
        );
        console.log('zone', i + 1);
        if (getZoneBuy) {
          await getZoneBuy.click();
          break;
        }
      }
      continue;
    }
  }
  await delay(2000);
  const position = await page2.$$eval('#wrap > svg > image', (elms) => {
    let positionPass: any[] = [];
    elms?.forEach((e) => {
      if (e.getAttribute('href')?.includes('seat-blue.png')) {
        const getPosition = e.getBoundingClientRect();
        positionPass.push({ x: getPosition.x, y: getPosition.y });
      }
    });
    return positionPass;
  });
  for (let p = 0; p < position?.length; p++) {
    await page2.mouse.click(position[p].x, position[p].y, { button: 'left' });
  }
  console.log('finish click');

  await delay(2000);

  await page2.$eval(
    '#select-variant > div.box-placeorder > div.button-f > button',
    (elm) => elm.click()
  );

  // a.getBoundingClientRect()
  // let getZoneBuy = await page2.waitForSelector(
  //   '#zone-box > ul > li:nth-child(5)'
  // );
  // console.log('getZoneBuy: ', getZoneBuy);
  // if (getZoneBuy) {
  //   await getZoneBuy.click();
  // }
  // await delay(1000);
  // let getChair = await page2.waitForSelector(
  //   '#wrap > svg > image:nth-child(1)'
  // );
  // console.log('getChair: ', getChair);
  // if (getChair) {
  //   await getChair.click();
  // }

  // await delay(100);

  // let getBtnSubmit = await page2.waitForSelector(
  //   '#select-variant > div.box-placeorder > div.button-f > button'
  // );
  // console.log('getBtnSubmit: ', getBtnSubmit);
  // //
  // if (getBtnSubmit) {
  //   await getBtnSubmit.click();
  // }
  // //   await page2.evaluate(() => {
  // //     const zoneList = document.querySelectorAll('#zone-box > ul > li');
  // //     console.log('zoneList: ', zoneList);
  // //   });
  // console.log('close');
  // //   await browser.close();
})();
