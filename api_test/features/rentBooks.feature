Feature: API de alugar Livros

  Scenario: Realizar o emprestimo de livros para um usuário
    Given que eu crie e autentique um usuário na API
    And que eu consulte um livro disponível para empréstimo
    When eu faço uma requisição para alugar o livro
    Then a API de aluguel de livros deve retornar o status 201
    And os livros devem ser apresentados no perfil do usuário