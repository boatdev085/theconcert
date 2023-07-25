"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import puppeteer
const axios_1 = __importDefault(require("axios"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function delay(time) {
    return new Promise(function (resolve) {
        setTimeout(resolve, time);
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Launch the browser
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
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
    const browser = yield puppeteer_1.default.launch({
        headless: false,
        ignoreHTTPSErrors: true,
        args: [`--window-size=1920,1080`],
        defaultViewport: {
            width: 1920,
            height: 1080,
        },
    });
    //   // Create a page
    const page = yield browser.newPage();
    // const cookies = fs.readFileSync('cookies.json', 'utf8');
    // if (cookies) {
    //   const deserializedCookies = JSON.parse(cookies);
    //   await page.setCookie(...deserializedCookies);
    // }
    // console.log('cookies: ', cookies);
    //   // Go to your site
    yield page.goto(`https://www.theconcert.com/`);
    // Query for an element handle.
    // const localStorageFile = fs.readFileSync('localstorage.json', 'utf8');
    // const deserializedStorage = JSON.parse(localStorageFile);
    // console.log('deserializedStorage: ', deserializedStorage);
    // await page.evaluate((deserializedStorage) => {
    //   for (const key in deserializedStorage) {
    //     localStorage.setItem(key, deserializedStorage[key]);
    //   }
    // }, deserializedStorage);
    yield delay(1500);
    yield page.waitForSelector('#popup-modal');
    const btnBeforeLogin = yield page.waitForSelector('#shortcut_bar > div > div > div.short-profile.cursor-pointer.d-none.d-md-block');
    if (btnBeforeLogin) {
        yield page.$eval('#shortcut_bar > div > div > div.short-profile.cursor-pointer.d-none.d-md-block', (elm) => elm.click());
    }
    yield delay(1000);
    yield page.waitForSelector('#_login');
    yield page.focus('#_login');
    yield page.keyboard.type(process.env.USERNAME || '', { delay: 10 });
    yield page.waitForSelector('#password-field');
    yield page.focus('#password-field');
    yield page.keyboard.type(process.env.PASSWORD || '', { delay: 10 });
    yield page.waitForSelector('#login_btn');
    yield page.$eval('#login_btn', (elm) => elm.click());
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
    const getAccessToken = yield new Promise((resolve) => {
        page.on('response', (response) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const request = response.request();
            if (request.url().includes('www.theconcert.com/rest/users/login')) {
                const responseLogin = yield response.json();
                resolve((_a = responseLogin === null || responseLogin === void 0 ? void 0 : responseLogin.response) === null || _a === void 0 ? void 0 : _a.access_token);
            }
        }));
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
    const page2 = yield browser.newPage();
    // //   // Go to your site
    yield page2.goto(`https://www.theconcert.com/concert/${process.env.ID_CONCERT}/stage?queue=${getAccessToken}`);
    const getList = yield axios_1.default.get(`https://api.theconcert.com/v3/products/${process.env.ID_CONCERT}/variants?limit=10&page=1`);
    if (((_a = getList === null || getList === void 0 ? void 0 : getList.data) === null || _a === void 0 ? void 0 : _a.data) && ((_d = (_c = (_b = getList === null || getList === void 0 ? void 0 : getList.data) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.record) === null || _d === void 0 ? void 0 : _d.length) > 0) {
        for (let i = 0; i < ((_g = (_f = (_e = getList === null || getList === void 0 ? void 0 : getList.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.record) === null || _g === void 0 ? void 0 : _g.length); i++) {
            if (!((_m = (_l = (_k = (_j = (_h = getList === null || getList === void 0 ? void 0 : getList.data) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j.record[i]) === null || _k === void 0 ? void 0 : _k.display_text) === null || _l === void 0 ? void 0 : _l.toLowerCase()) === null || _m === void 0 ? void 0 : _m.includes('sold'))) {
                let getZoneBuy = yield page2.waitForSelector(`#zone-box > ul > li:nth-child(${i + 1})`);
                console.log('zone', i + 1);
                if (getZoneBuy) {
                    yield getZoneBuy.click();
                    break;
                }
            }
            continue;
        }
    }
    yield delay(2000);
    const position = yield page2.$$eval('#wrap > svg > image', (elms) => {
        let positionPass = [];
        elms === null || elms === void 0 ? void 0 : elms.forEach((e) => {
            var _a;
            if ((_a = e.getAttribute('href')) === null || _a === void 0 ? void 0 : _a.includes('seat-blue.png')) {
                const getPosition = e.getBoundingClientRect();
                positionPass.push({ x: getPosition.x, y: getPosition.y });
            }
        });
        return positionPass;
    });
    for (let p = 0; p < (position === null || position === void 0 ? void 0 : position.length); p++) {
        yield page2.mouse.click(position[p].x, position[p].y, { button: 'left' });
    }
    console.log('finish click');
    yield delay(2000);
    yield page2.$eval('#select-variant > div.box-placeorder > div.button-f > button', (elm) => elm.click());
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
}))();
