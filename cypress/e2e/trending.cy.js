import truncate from "lodash/truncate";

let scoreConverter = (score) => {
  return Math.ceil(score) / 2;
}

let labels = {
  0.5: 'Terrible',
  1: 'Terrible+',
  1.5: 'Poor',
  2: 'Poor+',
  2.5: 'Average',
  3: 'Average+',
  3.5: 'Good',
  4: 'Good+',
  4.5: 'Excellent',
  5: 'Excellent+',
};

let dayTrendingmovies; // List of movies from TMDB
let weekTrendingmovies; //
describe("Trending movie tests", () => {
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
    });

    it("displays the correct trending movies for in 24 hours or 7 days", () => {
      cy.get("a .MuiCardHeader-root").each(($card, index) => {
        cy.wrap($card).find("p").contains(truncate(dayTrendingmovies[index].title, {length: 19}));
      });
      cy.get("button").contains("In 7 days").click();
      cy.get("a .MuiCardHeader-root").each(($card, index) => {
        cy.wrap($card).find("p").contains(truncate(weekTrendingmovies[index].title, {length: 19}));
      });
    });
    
    it("display the correct score for each trending movies", () => {
      cy.get("a .MuiBox-root.css-d0uhtl").each(($card, index) => {
        let i = dayTrendingmovies[index].vote_average+0.001;
        console.log(i)
        console.log(index)
        cy.wrap($card).contains(labels[scoreConverter(i+0.001)]);
      });
      cy.get("button").contains("In 7 days").click();
      cy.get("a .MuiBox-root.css-d0uhtl").each(($card, index) => {
        let j = weekTrendingmovies[index].vote_average+0.001;
        console.log(labels[scoreConverter(j+0.001)])
        cy.wrap($card).contains(labels[scoreConverter(j+0.001)]);
      });
    })
  });
});