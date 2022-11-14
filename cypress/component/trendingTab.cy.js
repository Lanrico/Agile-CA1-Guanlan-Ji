import TrendingList from "../../src/components/trendingBar"
import Spinner from "../../src/components/spinner"

let dayTrendingmovies;
// let weekTrendingmovies;

describe('trending.cy.js', () => {
  before(() => {
    // Get the discover movies from TMDB and store them locally.
    cy.request(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&page=1`
    )
      .its("body") // Take the body of HTTP response from TMDB
      .then((response) => {
        dayTrendingmovies = response.results;
      });
    cy.request(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${Cypress.env(
        "TMDB_KEY"
      )}&language=en-US&page=1`
    )
      .its("body") // Take the body of HTTP response from TMDB
      .then((response) => {
        // weekTrendingmovies = response.results;
      });
  });
  it('added correctly', () => {
    // console.log(dayTrendingmovies[1])
    // cy.mount(<TrendingList type={"person"} time_window={"day"} />)
  });
});