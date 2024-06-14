import "@/public/Loader.css";

const Loader = () => {
  return (
    <section
      data-testid="loader-section"
      className="m-auto flex h-full w-full flex-col items-center justify-center"
    >
      <div className="container" data-testid="loader-container">
        <div className="box" data-testid="loader-box" />
        <div className="box" data-testid="loader-box" />
        <div className="box" data-testid="loader-box" />
        <div className="box" data-testid="loader-box" />
        <div className="box" data-testid="loader-box" />
      </div>
      <p
        data-testid="loader-text"
        className="mt-4 text-xl font-medium text-primary"
      >
        Cargando...
      </p>
    </section>
  );
};

export default Loader;
