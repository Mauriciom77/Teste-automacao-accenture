# features/demoqa.feature
Feature: Acessar a página inicial do DemoQA

Scenario: Navegar e preencher um formulario de teste
    Given que eu navego para o site "https://demoqa.com/"
    When eu seleciono a opção "Forms" no menu principal
    And eu clico no submenu "Practice Form"
    And eu preencho todos os dados do formulario e enviar
    Then deve apresentar um pop up de confirmação
    Then deve fechar o pop up de confirmação
