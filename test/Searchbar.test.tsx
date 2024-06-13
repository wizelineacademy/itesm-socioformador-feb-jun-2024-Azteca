import SearchBar from "@/components/SearchBar";
import { render } from "@testing-library/react";
import { describe, it } from "vitest";

describe("Searchbar Component Test", () => {
  it("Should be rendered on the screen", () => {
    render(<SearchBar placeholder="Prueba" />);
  });
});
