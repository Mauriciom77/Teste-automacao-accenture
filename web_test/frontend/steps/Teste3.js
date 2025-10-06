// features/step_definitions/demoqa_steps.js
const { Given, When, Then, AfterAll, setDefaultTimeout } = require('@cucumber/cucumber');
const { Builder, By, until } = require('selenium-webdriver');
const { faker } = require('@faker-js/faker');// Gerador de dados
const assert = require('assert');
require('chromedriver');

let driver;

// Variaveis de cadastro
let primeiroNome = [];
let ultimoNome = [];
let email = [];
let idade = [];
let salario = [];
let departamento = [];


setDefaultTimeout(4 * 60 * 1000); // 4 minutos

// Hook para configurar o driver antes de todos os cenários
Given('que eu acesso o site {string}', async function (url) {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.get(url);
    await driver.manage().window().setRect({
        width: 1366,
        height: 1180
    });
});

When('eu seleciono a opção "Elements" no menu principal', async function () {
    // Esperando a pagina carregar
    const formsElement = await driver.wait(until.elementLocated(By.xpath("//div[@id='app']//h5[text()='Elements']")), 3000);
    await formsElement.click();
});

Then('eu clico na opção "Web Tables"', async function () {
    try {
        // Esperando a pagina carregar
        await driver.wait(until.elementLocated(By.xpath("//span[text()='Web Tables']")), 3000);
        await driver.findElement(By.xpath("//span[text()='Web Tables']")).click();
    } catch {
        // Caso o menu esteja colapsado
        await driver.findElement(By.xpath("//div[text()='Elements']")).click();
        await driver.wait(until.elementLocated(By.xpath("//span[text()='Web Tables']")), 3000);
        await driver.findElement(By.xpath("//span[text()='Web Tables']")).click();
    }

    await driver.wait(until.elementLocated(By.id("addNewRecordButton")), 3000);
});

Then('eu crio um novo registro na tabela', async function () {
    await driver.findElement(By.id("addNewRecordButton")).click();

    // esperando o modal abrir
    await driver.wait(until.elementLocated(By.id("userForm")), 3000);

    //Preenchendo o formulario
    primeiroNome.push(faker.person.firstName());
    await driver.findElement(By.id("firstName")).sendKeys(primeiroNome[0]);

    ultimoNome.push(faker.person.lastName());
    await driver.findElement(By.id("lastName")).sendKeys(ultimoNome[0]);

    email.push(faker.internet.email({ firstName: primeiroNome[0], lastName: ultimoNome[0] }));
    await driver.findElement(By.id("userEmail")).sendKeys(email[0]);

    idade.push(faker.number.int({ min: 18, max: 99 }).toString());
    await driver.findElement(By.id("age")).sendKeys(idade[0]);

    salario.push(faker.number.int({ min: 1000, max: 10000 }).toString());
    await driver.findElement(By.id("salary")).sendKeys(salario[0]);

    departamento.push(faker.commerce.department());
    await driver.findElement(By.id("department")).sendKeys(departamento[0]);

    // Enviando o formulario
    await driver.findElement(By.id("submit")).click();
});

Then('valido se o novo registro foi criado', async function () {
    // Validando se o registro foi criado
    await driver.wait(until.elementLocated(By.id("addNewRecordButton")), 3000);

    const firstNameValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]`));
    assert.strictEqual(await firstNameValue.getText(), primeiroNome[0]);

    // Último Nome
    const lastNameValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/following-sibling::div[1]`));
    assert.strictEqual(await lastNameValue.getText(), ultimoNome[0]);

    // Idade
    const ageValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/following-sibling::div[2]`));
    assert.strictEqual(await ageValue.getText(), idade[0]);

    // Email
    const emailValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/following-sibling::div[3]`));
    assert.strictEqual(await emailValue.getText(), email[0]);

    // Salário
    const salaryValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/following-sibling::div[4]`));
    assert.strictEqual(await salaryValue.getText(), salario[0]);

    // Departamento
    const departmentValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/following-sibling::div[5]`));
    assert.strictEqual(await departmentValue.getText(), departamento[0]);
});

Then('eu edito um registro na tabela', async function () {
    // Trocando o nome
    await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/..//span[contains(@id,'edit-record')]`)).click();
    await driver.wait(until.elementLocated(By.id("userForm")), 3000);

    // Editando o primeiro nome
    primeiroNome.length = 0;
    primeiroNome.push(faker.person.firstName());
    const firstNameField = await driver.findElement(By.id("firstName"));
    await firstNameField.clear();
    await firstNameField.sendKeys(primeiroNome[0]);

    // Enviando o formulario
    await driver.findElement(By.id("submit")).click();
});

Then('valido se o registro foi editado', async function () {
    // Validando se o registro foi editado
    await driver.wait(until.elementLocated(By.id("addNewRecordButton")), 3000);

    const firstNameValue = await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]`));
    assert.strictEqual(await firstNameValue.getText(), primeiroNome[0]);
});


Then('eu excluo um registro na tabela', async function () {
    // Trocando o nome
    await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]/..//span[contains(@id,'delete-record-')]`)).click();

    // esperando a animação da tela 
    await driver.sleep(500);
});

Then('valido se o registro foi excluído', async function () {
    try {
        await driver.findElement(By.xpath(`//div[text()="${primeiroNome[0]}"]`));
        assert.fail('O registro não foi excluído');
    } catch (error) {
        assert.ok(true, 'O registro foi excluído com sucesso');
    }
});

Then('bonus criando registros', async function () {
    // criando 12 registros
    for (let i = 0; i < 11; i++) {
        //Preenchendo o formulario
        primeiroNome.push(faker.person.firstName());
        ultimoNome.push(faker.person.lastName());
        email.push(faker.internet.email({ firstName: primeiroNome, lastName: ultimoNome }));
        idade.push(faker.number.int({ min: 18, max: 99 }).toString());
        salario.push(faker.number.int({ min: 1000, max: 10000 }).toString());
        departamento.push(faker.commerce.department());
    }

    for (let i = 0; i < primeiroNome.length; i++) {
        await driver.findElement(By.id("addNewRecordButton")).click();

        // esperando o modal abrir
        await driver.wait(until.elementLocated(By.id("userForm")), 3000);

        await driver.findElement(By.id("firstName")).sendKeys(primeiroNome[i]);
        await driver.findElement(By.id("lastName")).sendKeys(ultimoNome[i]);
        await driver.findElement(By.id("userEmail")).sendKeys(email[i]);
        await driver.findElement(By.id("age")).sendKeys(idade[i]);
        await driver.findElement(By.id("salary")).sendKeys(salario[i]);
        await driver.findElement(By.id("department")).sendKeys(departamento[i]);

        // Enviando o formulario
        await driver.findElement(By.id("submit")).click();

        // Botão de add disponivel
        await driver.wait(until.elementLocated(By.id("addNewRecordButton")), 3000);
    }
});

Then('bonus eu excluo os itens criados', async function () {
    // Apagando os registros criados
    let apagados = 0;

    for (const nome of primeiroNome) {
        let tentativas = 0;
        let apagado = false;

        while (tentativas < 3 && !apagado) {
            tentativas++;
            try {
                // Procura o nome na tabela
                const celulaNome = await driver.findElement(By.xpath(`//div[contains(@class, "rt-td") and normalize-space(text())="${nome}"]`));

                // Encontra a linha
                const linha = await celulaNome.findElement(By.xpath('./ancestor::div[contains(@class, "rt-tr-group")]'));

                // Encontra e clica no botão de excluir
                const botaoExcluir = await linha.findElement(By.css('[title="Delete"]'));
                await botaoExcluir.click();

                // Aguarda e verifica se foi apagado
                await driver.sleep(700);

                // Verifica se o nome ainda existe
                const aindaExiste = await driver.findElements(By.xpath(`//div[contains(@class, "rt-td") and text()="${nome}"]`));

                if (aindaExiste.length === 0) {
                    console.log(`"${nome}" apagado com sucesso`);
                    apagado = true;
                    apagados++;
                } else {
                    console.log(`"${nome}" ainda existe, tentando novamente...`);
                }

            } catch (error) {
                if (error.name.includes('NoSuchElement')) {
                    console.log(`"${nome}" já foi apagado ou não existe`);
                    apagado = true;
                    break;
                } else {
                    console.log(`Erro na tentativa ${tentativas} para "${nome}":`, error.message);
                }
            }
        }

        if (!apagado) {
            console.log(`Não foi possível apagar "${nome}" após ${tentativas} tentativas`);
        }
    }

    console.log(`CONCLUSÃO: ${apagados}/${primeiroNome.length} apagados com sucesso`);
    await driver.close();
});

AfterAll(async function () {
  if (driver) {
    await driver.quit();
  }
});