import LoginBlock from "../../src/components/loginBlock"

describe("The login component", () => {
	it('added correctly', () => {
		cy.mount(<LoginBlock />)
	});
	it("handle when entering the incorrect password or email", () => {
		cy.mount(<LoginBlock />)
		cy.enterEmailAndPasswordAndLogin("321321@321.com", "321321")
	});
	describe("Enter the correct email and password", () => {
		beforeEach(() => {
			cy.mount(<LoginBlock />)
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
})