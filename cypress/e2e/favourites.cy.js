import truncate from "lodash/truncate";
let movies;
const movieId = 497582; // Enola Holmes movie id

describe("The favourites feature", () => {
  before(() => {
    cy.request(
      `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body")
      .then((response) => {
        movies = response.results;
      });
  });
  beforeEach(() => {
    cy.visit("/");
  });

  describe("The favourites page", () => {
    beforeEach(() => {
      // Select two favourites and navigate to Favourites page
      cy.get("button[aria-label='add to favorites']").eq(1).click();
      cy.get("button[aria-label='add to favorites']").eq(3).click();
      cy.get("button").contains("Favorites").click();
    });

    describe("delete the favourites", () => {
      it(" Only show the movies are not deleted", () => {
        cy.get("button[aria-label='remove from favorites']").eq(0).click();
        cy.get(".MuiCardHeader-content")
        .eq(0)
        .find("p")
        .contains(truncate(movies[3].title, {length:21}));
      });
      it(" The deleted movie do not show the red heart", () => {
        cy.get("button[aria-label='remove from favorites']").eq(0).click();
        cy.get("button").contains("Home").click();
        cy.get(".MuiCardHeader-root").eq(1).find("svg").should("not.exist");
      });
    });
  });
});