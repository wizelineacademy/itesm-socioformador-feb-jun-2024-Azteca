describe("Login", () => {
  it("Visits Login page, and signs in", () => {
    cy.visit("/");
    cy.get("label").contains("Email").click().type("cypress@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.url().should("include", "/profile");
  });
  it("Visits page not being signed in, and gets redirected to login", () => {
    cy.visit("/profile");
    cy.url().should("include", "/login");
  });
  it("Tries to sign in with wrong credentials", () => {
    cy.visit("/");
    cy.get("label").contains("Email").click().type("prueba@gmail.com");
    cy.get("label").contains("Password").click().type("prueba");
    cy.get("button").contains("Log in").click();
    cy.get("div").contains("Email or password is not valid.").should("exist");
    cy.url().should("include", "/login");
  });
});