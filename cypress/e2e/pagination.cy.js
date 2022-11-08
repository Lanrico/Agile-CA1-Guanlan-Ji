
let movies; 

describe("Pagination tests", () => {
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

  describe("Make correct pagination for movie list page", () => {
    it("displays 20 movies and the pagination panel", () => {
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").should("have.length", 20);
      cy.get(".MuiPagination-ul>li>a").should("have.length", 10);
    });

    it("displays the correct selected pagination button", () => {
      cy.get(".MuiPagination-ul>li").each(($button, index) => {
        if (index == 2) {cy.get($button).find("a[aria-current='true']")}
        else {cy.get($button).find("a[aria-current='true']").should("not.exist")}
      });
    });

    it("display the correct movies in the other page", () => {
      cy.get("a[aria-label='Go to page 2']").click();
      cy.url().should("include", `/page2`);
      cy.get(".MuiCardHeader-root").should("have.length", 40);
    });
    it("handle the situation that have no movie", () => {
      cy.get("button").contains("Favorites").click();
      cy.get(".MuiPagination-ul>li>a").should("have.length", 4);
    });
  });    
  describe("Have the correct functions for other nagination buttons", () =>{
    it("the previous and next button", () => {
      cy.wait(1000);
      cy.get("a[aria-label='Go to page 2']").click();
      cy.get("a[aria-label='Go to previous page']").click();
      cy.url().should("include", `/page1`);
      cy.get("a[aria-label='Go to next page']").click();
      cy.url().should("include", `/page2`);
    });
    it("the first and last button", () => {
      cy.get("a[aria-label='Go to page 2']").click();
      cy.get("a[aria-label='Go to first page']").click();
      cy.url().should("include", `/page1`);
      cy.get("a[aria-label='Go to last page']").click();
      cy.url().should("include", `/page100`);
    });
  });
  describe(
    "when the viewport is a mobile scale", {
      viewportHeight: 896,
      viewportWidth: 450,
    },
    () => {
      it("displays 5 movies and the 4 pages button", () => {
        for (var i = 0; i < 20; i++){
          cy.get("button[aria-label='add to favorites']").eq(i).click();
        }
        cy.get("header").find("button").click();
        cy.get("li").contains('Favorites').click();
        cy.wait(1000);
        cy.get(".MuiCardHeader-root").should("have.length", 5);
        cy.get(".MuiPagination-ul>li>a").should("have.length", 8);
      });
    }
  );
});