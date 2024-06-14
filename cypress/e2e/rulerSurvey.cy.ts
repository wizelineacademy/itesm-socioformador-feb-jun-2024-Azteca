const randomEmotion = {
  row: Math.floor(Math.random() * 12),
  col: Math.floor(Math.random() * 12),
};

//José Carlos Sánchez Gómez - A01174050
describe("Testing different surveys", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.get("label").contains("Email").click().type("cypress@outlook.com");
    cy.get("label").contains("Password").click().type("cypress");
    cy.get("button").contains("Log in").click();
    cy.wait(8000);
    cy.url().should("include", "/dashboard");
    cy.get('[data-testid="notification-button"]').click();
    cy.get('[data-testid="Daily Ruler Survey"]').click();
    cy.get('[data-testid="ruler-survey"]').should("exist");
  });

  it("should render step two after click", () => {
    cy.get(
      `[data-testid="emotion-${randomEmotion.row}-${randomEmotion.col}"]`,
    ).click();
    cy.get('[data-testid="ruler-step-two"]').should("exist");
  });
  it("should render step one after go back", () => {
    cy.get(
      `[data-testid="emotion-${randomEmotion.row}-${randomEmotion.col}"]`,
    ).click();
    cy.get('[data-testid="ruler-step-two"]').should("exist");
    cy.get("button").contains("Go back").click();
    cy.get('[data-testid="ruler-step-one"]').should("exist");
  });
  it("should have same emotion on comment section", () => {
    cy.get(
      `[data-testid="emotion-${randomEmotion.row}-${randomEmotion.col}"]`,
    ).trigger("mouseover");
    let emotionName: string;
    cy.get(
      `[data-testid="emotion-name-${randomEmotion.row}-${randomEmotion.col}"]`,
    )
      .invoke("text")
      .then((text) => (emotionName = text));
    cy.get(
      `[data-testid="emotion-${randomEmotion.row}-${randomEmotion.col}"]`,
    ).click();
    cy.get('[data-testid="ruler-step-two"]').should("exist");
    cy.get('[data-testid="chosen-emotion"]')
      .invoke("text")
      .should((chosenEmotion) => {
        expect(chosenEmotion).to.eq(emotionName);
      });
  });
  it("should type additional comment on step two", () => {
    cy.get(
      `[data-testid="emotion-${randomEmotion.row}-${randomEmotion.col}"]`,
    ).click();
    cy.get('[data-testid="ruler-step-two"]').should("exist");
    cy.get("textarea").type("This is a test comment");
    cy.get("textarea").invoke("val").should("eq", "This is a test comment");
  });
});
