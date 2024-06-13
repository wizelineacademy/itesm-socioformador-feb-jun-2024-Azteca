import ComboBoxSearch from "@/components/ComboBoxSearch";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// Mock the creation of users
vi.mock("@/services/user", () => {
  return {
    searchUsers: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        photoUrl: "http://example.com/john.jpg",
      },
      {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        photoUrl: "http://example.com/jane.jpg",
      },
      {
        id: 3,
        name: "Pedro Moreno",
        email: "pedropedrope@pe.com",
        photoUrl: "http://example.com/pedro.jpg",
      },
    ]),
  };
});

// Mock react
vi.mock("react", () => {
  return {
    useState: vi.fn().mockReturnValue(["t", vi.fn()]),
    useRef: vi.fn().mockReturnValue({ current: { focus: vi.fn() } }),
    useEffect: vi.fn(),
  };
});

// Mock navigation of next
vi.mock("next/navigation", () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
    }),
  };
});

// Get a query client
const queryClient = new QueryClient();

// Tests for coworkers search
describe("CoworkersSearch Component Test", () => {
  // Felipe de Jesús González Acosta A01275536 - Test #1/10
  // Test if the component renders correctly
  it("Should render the search input", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ComboBoxSearch />
      </QueryClientProvider>,
    );
    expect(screen.getByTestId("navbar-searchbar")).toBeInTheDocument();
  });
  // Felipe de Jesús González Acosta A01275536 - Test #2/10
  // Test if the component expands when clicking
  it("Should expand the search input", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ComboBoxSearch />
      </QueryClientProvider>,
    );
    const searchBox = screen.getByTestId("search-box");
    const searchIcon = screen.getByTestId("search-icon");
    expect(searchBox).toHaveClass("w-64");
    fireEvent.click(searchIcon);
  });
});
