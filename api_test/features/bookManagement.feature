Feature: API de Livros

  Scenario: Realizar consultas dos livros
    When eu consulto a lista de todos os livros disponiveis
    Then a API de livros deve retornar o status 200
    And a resposta deve conter uma lista de livros