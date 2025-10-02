Feature: API de Usuários

  Scenario: Criar um usuário via API
    Given que eu crie um novo usuario
    When crio um usuário passando os dados nome de usuário e senha 
    Then o usuario devera ser criado
    And a API deve retornar o status 201

  Scenario: Gerando um token de acesso para o usuário
    When eu gero um token para o usuário já criado
    Then a API deve retornar status Success
    And a data de expiração do token
    And a o valor do token
    And resultado autorizando o acesso