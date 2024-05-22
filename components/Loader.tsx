import "@/public/Loader.css";

const Loader = () => {
  return (
    <section className="m-auto flex h-full w-full flex-col items-center justify-center">
      <div className="container">
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
        <div className="box" />
      </div>
      <p className="mt-4 text-xl font-medium text-primary">Cargando...</p>
    </section>
  );
};

export default Loader;
