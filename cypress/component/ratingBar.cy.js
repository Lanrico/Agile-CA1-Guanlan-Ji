import RatingBar from "../../src/components/ratingBar"
describe("The spinner component", () => {
	it('added correctly', () => {
		cy.mount(<RatingBar rate={5.5} />)
	});
	it('shows the correct rating', () => {
		cy.mount(<RatingBar rate={5.5} />).get(".MuiBox-root").contains("Average+")
	});
})
