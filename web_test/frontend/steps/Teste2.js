// features/step_definitions/demoqa_steps.js
const { Given, When, Then, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');
require('chromedriver');

let driver;
let originalWindow;
let originalWindows;

setDefaultTimeout(4 * 60 * 1000); // 4 minutos

// Hook para configurar o driver antes de todos os cenários
Given('que eu entre no site {string}', async function (url) {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get(url);
});

When('eu seleciono a opção "Alerts, Frame & Windows" no menu principal', async function () {
  // Esperando a pagina carregar
  const formsElement = await driver.wait(until.elementLocated(By.xpath("//div[@id='app']//h5[text()='Alerts, Frame & Windows']")), 3000);
  await formsElement.click();
});

Then('eu clico na opção "Browser Windows"', async function () {
  try {
    // Esperando a pagina carregar
    await driver.wait(until.elementLocated(By.xpath("//span[text()='Browser Windows']")), 3000);
    await driver.findElement(By.xpath("//span[text()='Browser Windows']")).click();
  } catch {
    // Caso o menu esteja colapsado
    await driver.findElement(By.xpath("//div[text()='Alerts, Frame & Windows']")).click();
    await driver.wait(until.elementLocated(By.xpath("//span[text()='Browser Windows']")), 3000);
    await driver.findElement(By.xpath("//span[text()='Browser Windows']")).click();
  }

  await driver.wait(until.elementLocated(By.id("browserWindows")), 3000);
});

Then('eu clico na opção de "New Windows" e espera abrir uma nova janela', async function () {
  // Obtendo a janela atual
  originalWindow = await driver.getWindowHandle();
  originalWindows = await driver.getAllWindowHandles();

  // Abrindo uma nova janela
  await driver.findElement(By.id("windowButton")).click();

  // Aguarda nova janela abrir
  await driver.wait(async () => {
    const windows = await driver.getAllWindowHandles();
    return windows.length > originalWindows.length;
  }, 3000);
});

Then('valido se a nova janela foi aberta', async function () {
  const allWindows = await driver.getAllWindowHandles();

  // Muda para a ultima janela
  const newWindow = allWindows[allWindows.length - 1];
  await driver.switchTo().window(newWindow);
});

Then('se o texto apresentado na nova janela esta correto', async function () {
  // Validando o texto da nova janela
  await driver.wait(until.elementLocated(By.id("sampleHeading")), 3000);
  const newPageText = await driver.findElement(By.id("sampleHeading")).getText();
  assert.strictEqual(newPageText, "This is a sample page");
});

Then('fecho a nova janela e a volta para a pagina original', async function () {
  // Fecha a nova janela e volta para a original
  await driver.close();
  await driver.switchTo().window(originalWindow);
  await driver.close();
});


AfterAll(async function () {
  if (driver) {
    await driver.quit();
  }
});