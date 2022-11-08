let dayTrendingmovies; // List of movies from TMDB
let weekTrendingmovies; //

describe("Base tests", () => {
  before(() => {
    // Get the discover movies from TMDB and store them locally.
    cy.request(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${Cypress.env(
          "TMDB_KEY"
        )}&language=en-US&include_adult=false&include_video=false&page=1`
      )
        .its("body") // Take the body of HTTP response from TMDB
        .then((response) => {
          dayTrendingmovies = response.results;
        });
    cy.request(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body") // Take the body of HTTP response from TMDB
      .then((response) => {
        weekTrendingmovies = response.results;
      });
    });
  beforeEach(() => {
    cy.visit("/");
  });

  describe("The Trending Movies bar", () => {
    it("displays the Trending Movies bar header and 20 trending movies", () => {
      cy.wait(1000);
      cy.get(".MuiTypography-h4").contains("What's popular");
      cy.get("a .MuiCardHeader-root").should("have.length", 20);
      cy.get("button").contains("In 7 days").click();
    });

    it("displays the correct trending movies for in 24 hours or 7 days", () => {
      cy.get(".MuiTypography-h4").contains("What's popular");
      cy.get("a .MuiCardHeader-root").should("have.length", 20);
      cy.get("button").contains("In 7 days").click();
    });
  });
});