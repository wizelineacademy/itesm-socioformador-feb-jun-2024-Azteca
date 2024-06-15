import ProjectCard from "@/components/ProjectCard";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/project", () => {
  return {
    getEmployeesInProjectById: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: "Juan",
        email: "juan@email.com",
        jobTitle: "Nada",
        department: "Nada",
        photoUrl: "",
      },
      {
        id: 2,
        name: "Pedro",
        email: "pedro@prueba.com",
        jobTitle: "Nada",
        department: "Nada",
        photoUrl: "",
      },
    ]),
  };
});

describe("ProjectCard Component Test", () => {
  // José Carlos Sánchez Gómez A01174050 - Test #7/10
  it("Should render the project card", async () => {
    const component = await ProjectCard({
      id: 1,
      name: "Project 1",
      date: "2022-01-01",
      description: "This is a test project",
    });

    render(component);
    const projectCard = screen.getByTestId(`project-${1}`);
    expect(projectCard).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01174050 - Test #8/10
  it("Should render all the coworkers", async () => {
    const component = await ProjectCard({
      id: 1,
      name: "Project 1",
      date: "2022-01-01",
      description: "This is a test project",
    });

    render(component);
    await waitFor(() => {
      const coworkers = screen.getAllByTestId("project-coworker");
      expect(coworkers).toHaveLength(2);
    });
  });

  // José Carlos Sánchez Gómez A01174050 - Test #9/10
  it("Should render all the properties", async () => {
    const component = await ProjectCard({
      id: 1,
      name: "Project 1",
      date: "2022-01-01",
      description: "This is a test project",
    });

    render(component);
    const projectName = screen.getByTestId("project-name");
    const projectDate = screen.getByTestId("project-date");
    const projectDescription = screen.getByTestId("project-description");
    expect(projectName).toHaveTextContent("Project 1");
    expect(projectDate).toHaveTextContent("2022-01-01");
    expect(projectDescription).toHaveTextContent("This is a test project");
  });
});
