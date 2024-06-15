import { vi, it, expect, describe } from "vitest";
import { getNotifications } from "@/services/notifications";

// Mock the dependencies

vi.mock("@/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: {
      id: "mockUserId",
    },
  }),
}));

vi.mock("@/db/drizzle", () => ({
  default: {
    select: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      innerJoin: vi.fn().mockReturnThis(),
      leftJoin: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
    })),
  },
}));

vi.mock("@/db/schema", () => ({
  finalSurvey: {
    id: "mockFinalSurveyId",
    scheduledAt: "mockDate",
    projectId: "mockProjectId",
    processed: false,
  },
  finalSurveyAnswer: {
    finalSurveyId: "mockFinalSurveyId",
    userId: "mockUserId",
  },
  project: { id: "mockProjectId", name: "mockProjectName" },
  projectMember: { projectId: "mockProjectId", userId: "mockUserId" },
  rulerSurveyAnswers: { userId: "mockUserId", answeredAt: "mockDate" },
  sprintSurvey: {
    id: "mockSprintSurveyId",
    scheduledAt: "mockDate",
    projectId: "mockProjectId",
    processed: false,
  },
  sprintSurveyAnswerProject: {
    sprintSurveyId: "mockSprintSurveyId",
    userId: "mockUserId",
  },
}));

vi.mock("drizzle-orm", () => ({
  eq: vi.fn(),
  and: vi.fn(),
  sql: vi.fn(),
  gte: vi.fn(),
  isNull: vi.fn(),
}));

// José Carlos Sánchez Gómez A01174050 - Test #6/10
describe("getNotifications", () => {
  it("should return notifications", async () => {
    const notifications = await getNotifications();
    expect(notifications).toEqual(expect.any(Array));
  });
});
