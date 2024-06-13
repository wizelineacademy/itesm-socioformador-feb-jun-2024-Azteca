import FormTextInput from "@/components/FormTextInput";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FormTextInput Component Test", () => {
  it("Should render input", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByTestId("name")).toBeInTheDocument();
  });
  it("Should render label", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });
  it("Should render password input", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByTestId("password")).toBeInTheDocument();
  });
  it("Should render password label", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
  });
  it("Should render password show button", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByText("Show")).toBeInTheDocument();
  });
  it("Should toggle password input", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    const input = screen.getByTestId("password") as HTMLInputElement;
    const button = screen.getByText("Show");
    expect(input.type).toBe("password");
    button.click();
    expect(input.type).toBe("text");
    button.click();
    expect(input.type).toBe("password");
  });
});
