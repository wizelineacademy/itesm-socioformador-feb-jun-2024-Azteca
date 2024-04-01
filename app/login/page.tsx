import Image from "next/image";

const Login = () => {
  return (
    <main className="from-primary flex h-dvh w-full items-center justify-center bg-gradient-to-r to-[#8671d3]">
      <section className="h-[80%] w-[459px] rounded-[20px] bg-white shadow-md">
        <p className=" mx-8 mt-10 text-center text-4xl font-medium leading-tight text-black">
          Welcome to Feedback Flow
        </p>
        <Image
          className="mx-auto my-6 rounded-lg border border-black px-3 hover:bg-gray-300"
          src="/slack.svg"
          alt="slack-logo"
          width={65}
          height={20}
        />
        <div className="mx-12 flex items-center justify-center">
          <div className="flex-grow border-t border-black"></div>
          <span className="mx-4 text-sm text-black">OR</span>
          <div className="flex-grow border-t border-black"></div>
        </div>
        <form className="mt-6 flex flex-col items-center justify-center">
          <label className="text-sm text-black">Email</label>
          <input
            className="my-2 h-10 w-[80%] rounded-lg border border-black bg-white px-2 text-black"
            type="email"
          />
        </form>
      </section>
    </main>
  );
};

export default Login;
