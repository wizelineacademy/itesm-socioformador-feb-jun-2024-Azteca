import FormTextInput from "@/components/FormTextInput";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FormTextInput Component Test", () => {
  // José Carlos Sánchez Gómez A01745810 - Test #1/10
  it("Should render input", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByTestId("name")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01745810 - Test #2/10
  it("Should render label", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01745810 - Test #3/10
  it("Should render password input", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByTestId("password")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01745810 - Test #4/10
  it("Should render password label", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01745810 - Test #5/10
  it("Should toggle password input", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByText("Show")).toBeInTheDocument();
    const input = screen.getByTestId("password") as HTMLInputElement;
    const button = screen.getByText("Show");
    expect(input.type).toBe("password");
    button.click();
    expect(input.type).toBe("text");
    button.click();
    expect(input.type).toBe("password");
  });
});
