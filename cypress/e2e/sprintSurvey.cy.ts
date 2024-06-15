describe("Sprint Survey", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("label").contains("Email").click().type("cypress@outlook.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(12000);
    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="notification-button"]').click();
    cy.get('[data-testid="Sprint Survey"]').click();
    cy.get('[data-testid="sprint-survey"]').should("exist");
  });

  // José Eduardo de Valle Lara A01734957
  it("Not allow to move forward if not done with step two", () => {
    cy.get("button").contains("Next").click();
    cy.get('[data-testid="sprint-step-two"]').should("exist");
    cy.wait(3000);
    cy.get("button").contains("Submit").click();
    cy.get("div")
      .contains("Please fill all the fields before submitting the survey")
      .should("exist");
  });
});
