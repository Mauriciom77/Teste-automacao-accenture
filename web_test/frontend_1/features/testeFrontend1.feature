# features/demoqa.feature
Feature: Acessar a página inicial do DemoQA
@teste1
Scenario: Navegar e preencher um formulario de teste
    Given que eu navego para o site "https://demoqa.com/"
    When eu seleciono a opção "Forms" no menu principal
    And eu clico no submenu "Practice Form"
    And eu preencho todos os dados do formulario e enviar
    Then deve apresentar um pop up de confirmação
    Then deve fechar o pop up de confirmação

@teste2
Scenario: Navegar na pagina de Alerts, Frames e Windows
    When eu seleciono a opção "Alerts, Frame & Windows" no menu principal
    And eu clico na opção "Browser Windows"
    And eu clico na opção de "New Windows" e espera abrir uma nova janela
    Then valido se a nova janela foi aberta
    And se o texto apresentado na nova janela esta correto
    And fecho a nova janela e a volta para a pagina original
