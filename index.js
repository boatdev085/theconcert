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
    //   // Go to your site
    yield page.goto(`https://www.theconcert.com/concert/${process.env.ID_CONCERT}`);
    // Query for an element handle.
    const btnReserve = yield page.waitForSelector('.btn-reserve');
    // Do something with element...
    console.log('btnReserve: ', btnReserve);
    if (btnReserve) {
        yield btnReserve.click(); // Just an example.
        yield btnReserve.dispose();
        // Dispose of handle
    }
    yield delay(500);
    const menuLogin = yield page.waitForSelector('.login-box > ul > li:nth-child(2)');
    console.log('menuLogin: ', menuLogin);
    if (menuLogin) {
        yield menuLogin.click();
    }
    yield page.waitForSelector('#email-login');
    yield page.focus('#email-login');
    yield page.keyboard.type(process.env.USERNAME || '', { delay: 10 });
    yield page.waitForSelector('#password-field-email');
    yield page.focus('#password-field-email');
    yield page.keyboard.type(process.env.PASSWORD || '', { delay: 10 });
    const btnLogin = yield page.waitForSelector('#login_email_btn');
    yield delay(1000);
    //   await page.setRequestInterception(true);
    yield (btnLogin === null || btnLogin === void 0 ? void 0 : btnLogin.click());
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
    //   console.log('getAccessToken', getAccessToken);
    const page2 = yield browser.newPage();
    //   // Go to your site
    yield page2.goto(`https://www.theconcert.com/concert/${process.env.ID_CONCERT}/stage?queue=${getAccessToken}`);
    let getZoneBuy = yield page2.waitForSelector('#zone-box > ul > li:nth-child(5)');
    console.log('getZoneBuy: ', getZoneBuy);
    if (getZoneBuy) {
        yield getZoneBuy.click();
    }
    yield delay(1000);
    let getChair = yield page2.waitForSelector('#wrap > svg > image:nth-child(1)');
    console.log('getChair: ', getChair);
    if (getChair) {
        yield getChair.click();
    }
    yield delay(100);
    let getBtnSubmit = yield page2.waitForSelector('#select-variant > div.box-placeorder > div.button-f > button');
    console.log('getBtnSubmit: ', getBtnSubmit);
    //
    if (getBtnSubmit) {
        yield getBtnSubmit.click();
    }
    //   await page2.evaluate(() => {
    //     const zoneList = document.querySelectorAll('#zone-box > ul > li');
    //     console.log('zoneList: ', zoneList);
    //   });
    console.log('close');
    //   await browser.close();
}))();
