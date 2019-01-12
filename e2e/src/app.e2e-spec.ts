import { AppPage, setMobilePlatForm, setDesktopPlatForm } from './app.po';
import { browser, element, by } from 'protractor';

describe('App(Mobile)', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    setMobilePlatForm();
  });

  it('should display short title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('教学培训管理系统');
  });
});

describe('App(Desktop)', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    setDesktopPlatForm();
  });

  it('should display full title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('大连理工大学专任教师教学培训管理系统');
  });

  it('should navigate to HomeComponent', () => {
    page.navigateTo();
    element(by.css('a[routerLink="/home"]')).click();
    browser.waitForAngular();

    expect(browser.getCurrentUrl()).toEndWith('/home');
  });

  it('should navigate to TrainingRecordModeComponent', () => {
    page.navigateTo();
    element(by.css('a[routerLink="/training-record-entry"]')).click();
    browser.waitForAngular();

    expect(browser.getCurrentUrl()).toEndWith(
      '/training-record-entry/entry-mode');
  });
});
