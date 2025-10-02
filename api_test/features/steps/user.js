import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

let response;
let user;

// Cenario 1 - Criar um usuário
Given('que eu crie um novo usuario', function () {
    user = {
        userName: 'Mauricio12',
        password: 'Teste@123'
    };
});

When('crio um usuário passando os dados nome de usuário e senha', async function () {
    // Fazedo a consulta da API
    try {
        response = await axios.post("https://demoqa.com/Account/v1/User", user);
    } catch (error) {
        // Pegando o erro em caso de falha
        response = error.response;
    }
    console.log("Status da Resposta:", response.status);
    console.log("Corpo da Resposta:", response.data);
});

Then('o usuario devera ser criado', function () {
    // Validando se os dados retornados estão corretos
    assert.ok(response.data.userID, "userId nao encontrado na resposta da API.");
    assert.strictEqual(response.data.username, user.userName, "Nome de usuario na resposta nao corresponde.");
});

Then('a API deve retornar o status {int}', function (statusCode) {
    // Validando o status retornado
    assert.strictEqual(response.status, statusCode);
});

// Cenario 2 - Gerar um token de acesso
When('eu gero um token para o usuário já criado', async function () {
    try{
        response = await axios.post("https://demoqa.com/Account/v1/GenerateToken", user);
    }catch (error){
        response = error.response;
    }
    console.log("Dados de retorno:", response.data);
    console.log("Status retonado:", response.status);
});

Then('a API deve retornar status Success', function(){
    // Validando o status esperado.
    assert.strictEqual(response.data.status, "Success", "Status diferente do esperado")
});

Then('a data de expiração do token', function(){
    // Validando o retorno da data de expiração e se a data é valida
    const expiredDate = new Date(response.data.expires);

    assert.ok(expiredDate, "Retorno da data de expiração vazio");
    
    // Verificando se a data é valida
    assert.ok(!isNaN(expiredDate.getDate()), "Data de expiração não é valida");

    // Validando se a data é futura
    const now = new Date();
    assert.ok(expiredDate > now, "Data de expiração deve ser futura");
});

Then('a o valor do token', function(){
    // Validando se o token retornou 
    assert.ok(response.data.token, "Retorno do token Vazio");
});

Then('resultado autorizando o acesso', function(){
    // Validando o retorno do result 
    const dataResult = response.data.result;

    assert.ok(dataResult.includes('success'), "A mensagem não retornou como esperado.");
});