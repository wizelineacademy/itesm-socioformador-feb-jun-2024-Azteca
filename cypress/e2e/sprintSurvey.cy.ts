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
});
