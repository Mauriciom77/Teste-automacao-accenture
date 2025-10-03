import { Given, When, Then } from "@cucumber/cucumber";
import axios from 'axios';
import assert from 'assert';

let response;

When('eu consulto a lista de todos os livros disponiveis', async function () {
    try {
        response = await axios.get("https://demoqa.com/BookStore/v1/Books");
    } catch (error) {
        // Pegando o erro em caso de falha
        response = error.response;
    }
    // console.log('--- Dados completos da API de livros ---', response.data.books);
});

Then('a API de livros deve retornar o status {int}', function (statusCode) {
    assert.strictEqual(response.status, statusCode);
});

Then('a resposta deve conter uma lista de livros', function () {
    const books = response.data.books;
    // assert.ok(books, "Não foram encontrados livros disponiveis");

    books.forEach(book => {
        console.log(book.title);
    });
});