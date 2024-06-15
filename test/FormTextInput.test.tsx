import React from "react";
import FormTextInput from "@/components/FormTextInput";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("FormTextInput Component", () => {
  //  José Eduardo de Valle Lara A01734957 - Test #1/5
  it("renders correctly with provided props", () => {
    render(<FormTextInput name="email" type="email" label="Email Address" />);

    const input = screen.getByTestId("email");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
  });

  // José Eduardo de Valle Lara A01734957 - Test #2/5
  it("toggles password visibility when show button is clicked", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);

    const input = screen.getByTestId("password");
    const toggleButton = screen.getByRole("button", { name: /show/i });

    expect(input).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.click(toggleButton);
    expect(input).toHaveAttribute("type", "password");
  });

  // José Eduardo de Valle Lara A01734957 - Test #3/5
  it("sets autocomplete attribute based on type and name", () => {
    render(<FormTextInput name="name" type="text" label="Full Name" />);

    const input = screen.getByTestId("name");
    expect(input).toHaveAttribute("autocomplete", "on");
  });

  // José Eduardo de Valle Lara A01734957 - Test #4/5
  it("sets autocomplete attribute for email", () => {
    render(<FormTextInput name="email" type="email" label="Email Address" />);

    const input = screen.getByTestId("email");
    expect(input).toHaveAttribute("autocomplete", "on");
  });

  // José Eduardo de Valle Lara A01734957 - Test #5/5
  it("sets autocomplete attribute off for other fields", () => {
    render(<FormTextInput name="username" type="text" label="Username" />);

    const input = screen.getByTestId("username");
    expect(input).toHaveAttribute("autocomplete", "off");
  });
});

describe("FormTextInput Component Test", () => {
  // José Carlos Sánchez Gómez A01174050 - Test #1/10
  it("Should render input", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByTestId("name")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01174050 - Test #2/10
  it("Should render label", () => {
    render(<FormTextInput name="name" type="text" label="Name" />);
    expect(screen.getByText("Name")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01174050 - Test #3/10
  it("Should render password input", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByTestId("password")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01174050 - Test #4/10
  it("Should render password label", () => {
    render(<FormTextInput name="password" type="password" label="Password" />);
    expect(screen.getByText("Password")).toBeInTheDocument();
  });

  // José Carlos Sánchez Gómez A01174050 - Test #5/10
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
