import RulerSurvey from "@/components/modals/ruler/RulerSurvey";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { Mock, describe, expect, it, vi } from "vitest";
// Mock user test
vi.mock("@/services/user", () => {
  return {
    getUserId: vi.fn().mockResolvedValue("prueba"),
  };
});

// Mock ruler survey
vi.mock("@/services/rulerSurvey", () => {
  return {
    submitRulerSurveyAnswer: vi.fn(),
  };
});

// Mock next navigation
vi.mock("next/navigation", () => {
  return {
    useRouter: vi.fn().mockReturnValue({
      refresh: vi.fn(),
    }),
  };
});

const mockSet = vi.fn();

vi.mock("", () => {
  return {
    setState: mockSet,
  };
});

const queryClient = new QueryClient();
let mockClose: Mock;

// Test for Ruler Survey
describe("RulerSurvey Component Test", () => {
  beforeEach(() => {
    mockClose = vi.fn();
  });
  // Felipe de Jesús González Acosta A01275536 - Test #3/10
  // Verify that the ruler component renders itself
  it("Should render the survey", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <RulerSurvey showModal={true} onClose={mockClose} />
      </QueryClientProvider>,
    );
    const rulerSurvey = screen.getByTestId("ruler-survey");
    expect(rulerSurvey).toBeInTheDocument();
  });
});
