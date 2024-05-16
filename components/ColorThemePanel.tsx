"use client";

import { useState } from "react";
import { ColorInput, useMantineColorScheme } from "@mantine/core";
import SunIcon from "./icons/SunIcon";
import MoonIcon from "./icons/MoonIcon";

const ColorThemePanel = () => {
  const { setColorScheme } = useMantineColorScheme();
  const [color, setColor] = useState("#6640D5");

  return (
    <div className="align-center mt-6 flex flex-col">
      <div className="flex justify-center gap-10">
        <div>
          <p className="text-grayText">Select a mode</p>
          <div className="flex gap-2">
            <button
              onClick={() => setColorScheme("light")}
              className="flex gap-2 rounded-lg border bg-white p-2"
            >
              <SunIcon color="text-black" size="h-6 w-6" />
              <p className="text-black">Light</p>
            </button>
            <button
              onClick={() => setColorScheme("dark")}
              className="flex gap-2 rounded-lg border bg-black p-2"
            >
              <MoonIcon color="text-white" size="h-6 w-6" />
              <p className="text-white">Dark</p>
            </button>
          </div>
        </div>
        <div className=" w-56">
          <p className="text-grayText">Select a color</p>
          <ColorInput
            size="md"
            radius="xl"
            aria-label="Theme Color"
            value={color}
            onChangeEnd={setColor}
            format="hex"
            swatches={[
              "#2e2e2e",
              "#868e96",
              "#fa5252",
              "#e64980",
              "#be4bdb",
              "#7950f2",
              "#4c6ef5",
              "#228be6",
              "#15aabf",
              "#12b886",
              "#40c057",
              "#82c91e",
              "#fab005",
              "#fd7e14",
            ]}
          />
        </div>
      </div>
      <div className="flex justify-center">
        <button className="mb-2 mt-4 rounded-lg bg-primary px-10 py-2 font-medium text-white drop-shadow-lg hover:bg-primary-dark">
          Update
        </button>
      </div>
    </div>
  );
};

export default ColorThemePanel;
