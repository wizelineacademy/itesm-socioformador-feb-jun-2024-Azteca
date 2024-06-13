//José Carlos Sánchez Gómez - A01174050
describe("Register", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Visits Register page, and signs up", () => {
    cy.task("deleteDummyUser", { email: "cypress@gmail.com" });
    cy.get("label").contains("Name").click().type("Cypress prueba");
    cy.get("label").contains("Email").click().type("cypress@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("label").contains("Job Title").click().type("Cypress");
    cy.get("label").contains("Department").click().type("QA");
    cy.get("button").contains("Register").click();
    cy.get("div").contains("Account created successfully.").should("exist");
    cy.wait(3000);
    cy.url().should("include", "/dashboard");
    cy.visit("/profile");
    cy.get("h2").contains("Cypress prueba");
  });

  it("Visits Register page, and signs up with an existing email", () => {
    cy.get("label").contains("Name").click().type("Cypress prueba");
    cy.get("label").contains("Email").click().type("cypress@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("label").contains("Job Title").click().type("Cypress");
    cy.get("label").contains("Department").click().type("QA");
    cy.get("button").contains("Register").click();
    cy.get("div").contains("Email already registered.").should("exist");
  });
});
