import clickSpecificElement from "../support/commands"
import enterEmailAndPasswordAndLogin from "../support/commands"

describe("The login feature", () => {
  beforeEach(() => {
    cy.visit("/page1");
  });
  it("displays the login feature in the homepage", () => {
    cy.get("main h1").contains("Sign in").should('be.visible');
    cy.get("#email").should('be.visible');
    cy.get("#password").should('be.visible');
});
  it("handle when entering the incorrect password or email", () => {
    cy.enterEmailAndPasswordAndLogin("321321@321.com", "321321")
    cy.get(".MuiAlert-standardError").contains("Invalid email or password");

  });
  describe("Enter the correct email and password", () => {
    beforeEach(() => {
      cy.enterEmailAndPasswordAndLogin("123@123.com", "123123")
      cy.clickSpecificElement("button[type='submit']", "Sign In", 0);
    })
    it("shows the correct alert and content and previous block do not show", () => {
      cy.get("h4").contains("Welcome,");
      cy.get(".MuiAlert-standardSuccess").contains("Login success");
      cy.get("main h1").contains("Sign in").should('not.visible');
      cy.get("#email").should('not.visible');
      cy.get("#password").should('not.visible');
    });
  });
});
