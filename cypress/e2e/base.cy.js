import truncate from "lodash/truncate";

let movies; // List of movies from TMDB
let movie; //

describe("Base tests", () => {
  before(() => {
    // Get the discover movies from TMDB and store them locally.
    cy.request(
      `https://api.themoviedb.org/3/discover/movie?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&include_adult=false&include_video=false&page=1`
    )
      .its("body") // Take the body of HTTP response from TMDB
      .then((response) => {
        movies = response.results;
      });
  });
  beforeEach(() => {
    cy.visit("http://localhost:3000/page1");
  });

  describe("The movie details page", () => {
    before(() => {
      cy.request(
        `https://api.themoviedb.org/3/movie/436270?api_key=${Cypress.env("TMDB_KEY")}`
      )
        .its("body")
        .then((movieDetails) => {
          movie = movieDetails;
        });
    });
    beforeEach(() => {
      cy.visit(`/movies/436270`);
    });
    it(" displays the movie length, revenue, votes, released date and production countries", () => {
      cy.get("ul")
        .eq(2)
        .within(() => {
          const lengthChipLabel = movie.runtime;
          const costsChipLabel = movie.revenue.toLocaleString();
          const votesChipLabel = movie.vote_average + " (" + movie.vote_count;
          const releasedDateChipLabel = movie.release_date;
          cy.get("span").eq(0).contains(lengthChipLabel);
          cy.get("span").eq(1).contains(costsChipLabel);
          cy.get("span").eq(2).contains(votesChipLabel);
          cy.get("span").eq(3).contains(releasedDateChipLabel);
        });
      cy.get("ul")
        .eq(3)
        .within(() => {
          const productionCountriesChipLabels = movie.production_countries.map((p) => p.name);
          productionCountriesChipLabels.unshift("Production Countries");
          cy.get("span").each(($card, index) => {
            cy.wrap($card).contains(productionCountriesChipLabels[index]);
          });
        });
    });
  });
});