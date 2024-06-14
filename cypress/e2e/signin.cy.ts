//José Carlos Sánchez Gómez - A01174050
describe("Register", () => {
  beforeEach(() => {
    cy.visit("/register");
  });

  it("Visits Register page, and signs up", () => {
    cy.task("deleteDummyUser", { email: "cypress2@gmail.com" });
    cy.get("label").contains("Name").click().type("prueba");
    cy.get("label").contains("Email").click().type("cypress2@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("label").contains("Job Title").click().type("Cypress");
    cy.get("label").contains("Department").click().type("QA");
    cy.get("button").contains("Register").click();
    cy.wait(2000);
    cy.get("div").contains("Account created successfully.").should("exist");
    cy.wait(60000);
    cy.url().should("include", "/dashboard");
    cy.visit("/profile");
    cy.wait(30000);
    cy.get("h2").contains("prueba");
  });

  it("Visits Register page, and signs up with an existing email", () => {
    cy.get("label").contains("Name").click().type("prueba");
    cy.get("label").contains("Email").click().type("cypress2@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("label").contains("Job Title").click().type("Cypress");
    cy.get("label").contains("Department").click().type("QA");
    cy.get("button").contains("Register").click();
    cy.get("div").contains("Email already registered.").should("exist");
  });
});
