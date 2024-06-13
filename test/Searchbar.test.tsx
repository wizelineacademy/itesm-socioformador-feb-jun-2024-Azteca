import SearchBar from "@/components/SearchBar";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";

describe("Searchbar Component Test", () => {
  // José Carlos Sánchez Gómez A01745810 - Test #10/10
  it("Should be rendered on the screen", () => {
    render(<SearchBar placeholder="Prueba" />);
  });
});
