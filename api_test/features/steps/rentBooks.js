import { Given, When, Then } from '@cucumber/cucumber';
import axios from 'axios';
import assert from 'assert';

let response;
let user;
let userId;
let token;
let bookIds = [];

Given('que eu crie e autentique um usuário na API', async function () {
    user = {
        userName: 'Mauricio42',
        password: 'Teste@123'
    };

    // Criando o usuário
    try {
        response = await axios.post("https://demoqa.com/Account/v1/User", user);
    } catch (error) {
        // Pegando o erro em caso de falha
        response = error.response;
    }

    //Obtendo o valor do userid
    userId = response.data.userID;

    // Gerando o token de acesso
    try {
        response = await axios.post("https://demoqa.com/Account/v1/GenerateToken", user);
    } catch (error) {
        response = error.response;
    }

    // Obtendo o token
    token = response.data.token;


    // autorizando o usuário
    try {
        response = await axios.post("https://demoqa.com/Account/v1/Authorized", user);
    } catch (error) {
        response = error.response;
    }
});

Then('que eu consulte um livro disponível para empréstimo', async function () {
    try {
        response = await axios.get("https://demoqa.com/BookStore/v1/Books");
    } catch (error) {
        // Pegando o erro em caso de falha
        response = error.response;
    }
    bookIds = response.data.books.map(book => book.isbn);
    assert.ok(bookIds.length > 0, "Não foram encontrados livros disponiveis");
});

When('eu faço uma requisição para alugar o livro', async function () {
    try {
        // Codifica usuario:senha em base64
        const credentials = btoa(`${user.userName}:${user.password}`);

        response = await axios.post("https://demoqa.com/BookStore/v1/Books", {
            userId: userId,
            collectionOfIsbns: [  
                { isbn: bookIds[0] },
                { isbn: bookIds[1] }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Auth-Basic': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        response = error.response;
    }
});

Then('a API de aluguel de livros deve retornar o status {int}', function (statusCode) {
    assert.strictEqual(response.status, statusCode);
});

// Cenario 6
Then('os livros devem ser apresentados no perfil do usuário', async function () {
    try {
        response = await axios.get(`https://demoqa.com/Account/v1/User/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'X-Auth-Basic': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        response = error.response;
    }
   
    
});