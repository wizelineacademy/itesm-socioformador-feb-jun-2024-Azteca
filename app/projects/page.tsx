import React from "react";
import NavigationBar from "@/components/NavigationBar";

const Projects = () => {
  return (
    <main>
      <section className="flex flex-col">
        <div className="flex justify-center gap-5">
          <h3 className="text-4xl font-medium">My Projects</h3>
          <button className="rounded-full bg-primary px-5 py-2 font-medium text-white drop-shadow-lg">
            Create
          </button>
        </div>
        <div className="mx-auto grid grid-cols-3 place-content-center justify-around gap-4">
          <div>01</div>
          <div>02</div>
          <div>03</div>
          <div>04</div>
          <div>05</div>
        </div>
      </section>
    </main>
  );
};

export default Projects;
