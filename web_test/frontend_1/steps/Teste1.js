// features/step_definitions/demoqa_steps.js
const { Given, When, Then, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until, Key } = require('selenium-webdriver');
const assert = require('assert');
const path = require('path');
const fs = require('fs');
require('chromedriver');

let driver;

setDefaultTimeout(4 * 60 * 1000); // 4 minutos

// Hook para configurar o driver antes de todos os cenários
Given('que eu navego para o site {string}', async function (url) {
  driver = await new Builder().forBrowser('chrome').build();
  await driver.get(url);
});

When('eu seleciono a opção "Forms" no menu principal', async function () {
  // Esperando a pagina carregar
  const formsElement = await driver.wait(until.elementLocated(By.xpath("//div[@id='app']//h5[text()='Forms']")), 3000);
  await formsElement.click();
});

Then('eu clico no submenu "Practice Form"', async function () {
  try {
    // Esperando a pagina carregar
    await driver.wait(until.elementLocated(By.xpath("//span[text()='Practice Form']")), 3000);
    await driver.findElement(By.xpath("//span[text()='Practice Form']")).click();
  } catch {
    // Caso o menu esteja colapsado
    await driver.findElement(By.xpath("//div[text()='Forms']")).click();
    await driver.wait(until.elementLocated(By.xpath("//span[text()='Practice Form']")), 3000);
    await driver.findElement(By.xpath("//span[text()='Practice Form']")).click();
  }

  await driver.wait(until.elementLocated(By.id("userName-wrapper")), 3000);
});

Then('eu preencho todos os dados do formulario e enviar', async function () {
  // Nome e sobrenome
  await driver.findElement(By.id("firstName")).sendKeys("Fernando");
  await driver.findElement(By.id("lastName")).sendKeys("Silva");

  // Email
  await driver.findElement(By.id("userEmail")).sendKeys("fernando.silva@example.com");

  // Gênero Masculino
  await driver.findElement(By.xpath("//label[@for='gender-radio-1']")).click();

  // Número de celular
  await driver.findElement(By.id("userNumber")).sendKeys("11987654321");

  // Data de nascimento
  await driver.executeScript(`
    document.getElementById('dateOfBirthInput').value = '15 Jan 1990';
    document.getElementById('dateOfBirthInput').dispatchEvent(new Event('change', { bubbles: true }));
    `);

  // Assuntos
  await driver.findElement(By.id("subjectsInput")).sendKeys("Teste automatizado");

  // Hobbies- Clicando pelo js por causa dos anuncios
  await driver.executeScript(`
    document.querySelector('input[id="hobbies-checkbox-3"]').click();
    `);

  // Scroll para o final da página
  await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");

  // Adicionando uma imagem
  const uploadInput = await driver.findElement(By.id("uploadPicture"));
  const filePath = path.join(__dirname, '..', '..', 'util', 'test.txt');
  await uploadInput.sendKeys(filePath);

  // adicionando um texto na area de texto
  const textoArea = "O teste automatizado acelera o ciclo de desenvolvimento, \
  permitindo a execução rápida e consistente de testes de regressão. Isso garante \
  que novas funcionalidades não introduzam defeitos, aumentando a confiabilidade \
  do software. Sua automação economiza tempo e recursos, permitindo que a equipe foque em tarefas mais estratégicas.";

  await driver.findElement(By.id("currentAddress")).sendKeys(textoArea);

  // Escolhendo Estado
  await driver.findElement(By.id('state')).click();
  await driver.sleep(500);
  await driver.findElement(By.id('react-select-3-input')).sendKeys('NCR', Key.ENTER);

  // Escolhendo Cidade
  await driver.findElement(By.id('city')).click();
  await driver.sleep(500);
  await driver.findElement(By.id('react-select-4-input')).sendKeys('Delhi', Key.ENTER);

  // Clicando em submit - Clicando pelo js por causa dos anuncios
  await driver.executeScript(`
    document.querySelector('button[id="submit"]').click();
    `);
});

Then('deve apresentar um pop up de confirmação', async function () {
  await driver.wait(until.elementLocated(By.id("example-modal-sizes-title-lg")), 3000);
  const modalTitle = await driver.findElement(By.id("example-modal-sizes-title-lg")).getText();
  assert.strictEqual(modalTitle, "Thanks for submitting the form");
});

Then('deve fechar o pop up de confirmação', async function () {
  await driver.executeScript(`
      document.querySelector('button[id="closeLargeModal"]').click();
      `);
});

AfterAll(async function () {
  if (driver) {
    await driver.quit();
  }
});