describe("Searchbar", () => {
  beforeEach(() => {
    cy.visit("/login");
    cy.get("label").contains("Email").click().type("cypress@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(25000);
  });
  it("Expands searchbar", () => {
    cy.get('[data-testid="search-box"]').should("have.class", "w-10");
    cy.get('[data-testid="search-icon"]').click();
    cy.get('[data-testid="search-box"]').should("have.class", "w-64");
  });

  /* 
    Pedro Alonso Moreno A01741437 - Test #1/1

    This test verifies that the searchbar shows
    a list of options with users when the user
    types the name "cypress" (its searching himself),
    then clicks on that list element an redirects
    to his profile page
  */
  it("Searches for a user", () => {
    cy.get('[data-testid="search-icon"]').click();
    const comboboxInput = cy.get('[data-testid="combobox-input"]');
    comboboxInput.should("have.focus");
    comboboxInput.type("cypress");
    cy.wait(8000);
    cy.get('[data-testid="option-cypress prueba"]').should("exist");
    cy.get('[data-testid="option-cypress prueba"]').click();
    cy.url().should("include", "/profile");
  });
});
