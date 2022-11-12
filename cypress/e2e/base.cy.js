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
    cy.visit("/page1");
  });

  describe("The Discover Movies page", () => {
    it("displays the page header and 20 movies", () => {
      cy.get("h3").contains("Discover Movies");
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").should("have.length", 20);
    });

    it("displays the correct movie titles", () => {
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(movies[index].title);
      });
    });
  });
  describe("The movie details page", () => {
    before(() => {
      cy.request(
        `https://api.themoviedb.org/3/movie/${
          movies[1].id
        }?api_key=${Cypress.env("TMDB_KEY")}`
      )
        .its("body")
        .then((movieDetails) => {
          movie = movieDetails;
        });
    });
    beforeEach(() => {
      cy.visit(`/movies/${movies[1].id}`);
    });
    it(" displays the movie title, overview and genres", () => {
      cy.get("h3").contains(movie.title);
      cy.get("h3").contains("Overview");
      cy.get("h3").next().contains(movie.overview);
      cy.get("ul")
        .eq(1)
        .within(() => {
          const genreChipLabels = movie.genres.map((g) => g.name);
          genreChipLabels.unshift("Genres");
          cy.get("span").each(($card, index) => {
            cy.wrap($card).contains(genreChipLabels[index]);
          });
        });
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