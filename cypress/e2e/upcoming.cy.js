import truncate from "lodash/truncate";

let upcomingMovies;

describe("Upcoming tests", () => {
  before(() => {
    cy.request(
      `https://api.themoviedb.org/3/movie/upcoming?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body")
      .then((response) => {
        upcomingMovies = response.results;
      });
  });
  beforeEach(() => {
    cy.visit("/movies/upcoming/page1");
  });

  describe("The upcoming movies page", () => {
    it("displays the upcoming page header and 20 upcoming movies", () => {
      cy.get("h3").contains("Upcoming Movies");
      cy.get(".MuiCardHeader-root").should("have.length", 20);
    });

    it("displays the correct movie titles", () => {
      cy.get(".MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(truncate(upcomingMovies[index].title, {length:21}));
      });
    });
  });

  describe("Add into must watch", () => {
    it("selected movie card shows the red add-to-must-watch svg", () => {
      cy.get(".MuiCardHeader-root").eq(0).find("svg").should("not.exist");
      cy.get("button[aria-label='add to must watch']").eq(0).click();
      cy.get(".MuiCardHeader-root").eq(0).find("svg");
      cy.get(".MuiCardHeader-root").eq(1).find("svg").should("not.exist");
      cy.get("button[aria-label='add to must watch']").eq(1).click();
      cy.get(".MuiCardHeader-root").eq(1).find("svg");
    });
  })
});