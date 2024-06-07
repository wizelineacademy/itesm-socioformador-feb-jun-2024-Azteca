describe("Profile", () => {
  beforeEach(() => {
    cy.visit("/profile");
    cy.get("label").contains("Email").click().type("cypress@gmail.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(3000);
    cy.visit("/profile");
  });
  it("Change banner image", () => {
    const randomNumber = Math.floor(Math.random() * 5);
    cy.get('[data-testid="user-icon-navbar"]').click();
    cy.get('[data-testid="settings-button"]').click();
    cy.get('[data-testid="banner-tab"]').click();
    cy.get(`[data-testid="banner-image-${randomNumber}"]`).click();
    cy.get("button").contains("Done").click();
    cy.get(`[data-testid="Banner${randomNumber}.svg"]`).should(
      "have.attr",
      "src",
      `/Banner${randomNumber}.svg`,
    );
  });
});
