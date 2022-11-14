import { excerpt } from "../../src/util";

let movies; // List of movies from TMDB
let movieReviews; //

describe("Reviews tests", () => {
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
    cy.visit("/");
    cy.request(
      `https://api.themoviedb.org/3/movie/
      ${movies[1].id}
      /reviews?api_key=${Cypress.env("TMDB_KEY")}`
    )
      .its("body")
      .then((reviews) => {
        movieReviews = reviews;
      });
  });

  describe("The movie reviews in the movie detail page", () => {
    it(" display the review author and excerpt", () => {
      cy.visit(`/movies/${movies[1].id}`);
      cy.get("h3");
      cy.get("button").contains("Reviews").click();
      const authorList = movieReviews.results.map(a => a.author);
      const excerptList = movieReviews.results.map(c => c.content);
      // console.log(excerpt(excerptList[0]).replace(/\s+/g, " "))
      cy.get("tbody>tr").each(($review, index) => {
        cy.wrap($review).get("th").contains(authorList[index]);
        cy.wrap($review).contains(excerpt(excerptList[index].split(" ")[0]));
        cy.wrap($review).contains(excerpt(excerptList[index].split(" ")[1]));
      });
    });
    it(" handle the situation that do not have any reviews", () => {
      cy.visit(`/movies/732459`);
      cy.get("h3");
      cy.get("button").contains("Reviews").click();
      cy.get("tbody>tr").should("have.length", 0);
    });
  });
  describe("The movie full review page", () => {
    beforeEach(() => {
      cy.visit(`/movies/${movies[1].id}`);
      cy.get("h3");
      cy.get("button").contains("Reviews").click();
      cy.get("td>a").contains("Full Review").eq(0).click();
    });
    it(" display the name of the author", () => {
      const author = movieReviews.results.map(a => a.author)[0];
      cy.get("p").eq(0).contains(author);
    });
    it(" display the content of the review", () => {
      const excerpt = movieReviews.results.map(c => c.content)[0];
      cy.get("p").eq(1).contains(excerpt.split(" ")[0]);
      cy.get("p").eq(1).contains(excerpt.split(" ")[1]);
    });
  });
});