let people;
let person;

let dayTrendingPeople;
let weekTrendingPeople;


describe("People page tests", () => {
  before(() => {
    cy.request(
      `https://api.themoviedb.org/3/person/popular?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body")
      .then((response) => {
        people = response.results;
      });
    cy.request(
      `https://api.themoviedb.org/3/trending/person/day?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&page=1`
    )
      .its("body")
      .then((response) => {
        dayTrendingPeople = response.results;
      });
    cy.request(
      `https://api.themoviedb.org/3/trending/person/week?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&page=1`
    )
      .its("body")
      .then((response) => {
        weekTrendingPeople = response.results;
      });

  });
  beforeEach(() => {
    cy.visit("/people/page1");
  });
  describe("The Discover People page", () => {
    it("displays the page header and 20 people", () => {
      cy.get("h3").contains("Discover People");
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").should("have.length", 20);
    });

    it("displays the correct people's names", () => {
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(people[index].name);
      });
    });
    describe("The trending bar", () => {
      it("displays the correct trending people for in 24 hours or 7 days", () => {
        cy.get(".MuiStack-root .MuiCardHeader-root").each(($card, index) => {
          cy.wrap($card).find("p").contains(dayTrendingPeople[index].name);
        });
        cy.get("button").contains("In 7 days").click();
        cy.get(".MuiStack-root .MuiCardHeader-root").each(($card, index) => {
          cy.wrap($card).find("p").contains(weekTrendingPeople[index].name);
        });
      });
      it("navigate to the correct person detail page", () => {
        cy.get(".MuiStack-root .MuiCardHeader-root").eq(0).click();
        cy.get("h3").contains(dayTrendingPeople[0].name);
      })
    })
  });
});