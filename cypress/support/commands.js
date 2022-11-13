// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
Cypress.Commands.add('clickSpecificElement', (elements, content, index) => {
  cy.get(elements).contains(content).eq(index).click()
});

// The test that must be looped by numbers instead of each
Cypress.Commands.add('checkEachTitle', (elements, content, begin, end, action) => {
  for (let i = begin; i < end; i++){
    if (action === "clickPagination")
    cy.get("li>button").eq(i).click();
    cy.get(elements).contains(content[i].title);
  }
});