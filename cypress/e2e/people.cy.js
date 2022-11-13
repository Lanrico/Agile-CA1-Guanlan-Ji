let people;
let person;
let personCreditMovies;
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
  });
  beforeEach(() => {
    cy.visit("/people/page1");
  });
  describe("The Discover People page", () => {
    it("displays the page header and 20 people", () => {
      cy.get("h3").contains("Discover People");
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").should("have.length", 20);
    });

    it("displays the correct people's names and popularity", () => {
      cy.get(".MuiGrid-grid-sm-6 .MuiCardHeader-content").each(($card, index) => {
        cy.wrap($card).find("p").contains(people[index].name);
      });
      cy.get(".MuiGrid-grid-xs-6 p").each(($card, index) => {
        cy.wrap($card).contains(people[index].popularity);
      });
    });
    describe("The trending bar", () => {
      before(() => {
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
      })
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
      });
    });
    it("displays the correct people's known_for movies", () => {
      cy.get(".MuiGrid-grid-sm-6 button").eq(0).click();
      cy.get(".MuiDialog-paper p").contains(people[0].known_for[0].title);
      cy.get(".MuiDialog-paper p").contains(people[0].known_for[1].title);
      cy.get(".MuiDialog-paper p").contains(people[0].known_for[2].title);
    });
  });

  describe("The person detail page", () => {
    before(() => {
      cy.request(
        `https://api.themoviedb.org/3/person/6193?api_key=${Cypress.env("TMDB_KEY")}`
      )
        .its("body")
        .then((personDetails) => {
          person = personDetails;
          person.gender === 1 ? person.gender = "Female" : person.gender === 2 ? person.gender = "Male" : person.gender = "LGBTQIA+"
        });
      cy.request(
        `https://api.themoviedb.org/3/person/6193/movie_credits?api_key=${Cypress.env("TMDB_KEY")}`
      )
        .its("body")
        .then((movies) => {
          personCreditMovies = movies;
        });
    });
    beforeEach(() => {
      cy.visit(`/people/6193`);
    });
    it(" displays the people name, biography", () => {
      cy.get("h3").contains(person.name);
      cy.get(".MuiGrid-grid-xs-12 h3").contains("Biography");
      cy.get("h3").next().contains(person.biography.split(" ")[0]);
      cy.get("h3").next().contains(person.biography.split(" ")[1]);
    });
    it(" displays correct basic information", () => {
      cy.get("table td").eq(0).contains(person.gender)
      cy.get("table td").eq(1).contains(person.birthday)
      cy.get("table td").eq(2).contains(person.place_of_birth)
    });
    it(" credit movies pagination work well and displays correct credit movies", () => {
      cy.get(".MuiGrid-grid-xl-3 p").contains(personCreditMovies.cast[0].title)
      cy.get("li>button").eq(1).click();
      cy.get(".MuiGrid-grid-xl-3 p").contains(personCreditMovies.cast[1].title)
      cy.get("li>button").eq(2).click();
      cy.get(".MuiGrid-grid-xl-3 p").contains(personCreditMovies.cast[2].title)
      cy.get("li>button").eq(3).click();
      cy.get(".MuiGrid-grid-xl-3 p").contains(personCreditMovies.cast[3].title)
      cy.get("li>button").eq(4).click();
      cy.get(".MuiGrid-grid-xl-3 p").contains(personCreditMovies.cast[4].title)
    });
    it("handle the condition that no credit movies", () => {
      cy.visit(`/people/2643681`);
      cy.get(".MuiGrid-grid-xl-3 p").should("not.exist");
    });
    describe(
      "when the viewport is a mobile scale", {
      viewportHeight: 896,
      viewportWidth: 414,
    },
      () => {
        it(" each part shows in the 100% width and obey the order", () => {
          cy.get(".MuiGrid-grid-xs-12")
        });
      }
    );
  });
});