describe("PCP", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("label").contains("Email").click().type("cypress@outlook.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(12000);
    cy.url().should("include", "/dashboard");
    cy.visit("/pcp");
    cy.wait(8000);
  });

  it("Should change the status of the task", () => {
    const statusButton = cy.get('[data-testid="task-status-button"]');
    statusButton.should("exist");
    statusButton.click();
    cy.get('[data-testid="IN_PROGRESS"]').click();

    cy.get("div").contains("Task status updated successfully").should("exist");
  });
});
