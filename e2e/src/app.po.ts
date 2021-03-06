import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getTitleText() {
    return element(by.css('app-root span.app-name')).getText();
  }
}

/** Set window size to match mobile platform. */
export function setMobilePlatForm() {
  browser.driver.manage().window().setSize(375, 867);
}

/** Set window size to match desktop platform. */
export function setDesktopPlatForm() {
  browser.driver.manage().window().setSize(1440, 546);
}
