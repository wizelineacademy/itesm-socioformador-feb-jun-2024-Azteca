describe("PCP", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.wait(8000);
    cy.get("label").contains("Email").click().type("cypress@outlook.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(12000);
    cy.url().should("include", "/dashboard");
    cy.visit("/pcp");
    cy.wait(8000);
  });
});
