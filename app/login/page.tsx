import Image from "next/image";

const Login = () => {
  return (
    <main className="from-primary flex h-dvh w-full items-center justify-center bg-gradient-to-r to-[#8671d3]">
      <section className="h-[80%] w-[459px] rounded-[20px] bg-white shadow-md">
        <p className="mx-8 mt-10 text-center text-4xl font-medium leading-tight text-black">
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
          <div className="flex-grow border-t border-black" />
          <span className="mx-4 text-sm text-black">OR</span>
          <div className="flex-grow border-t border-black" />
        </div>
        <form className="mx-12 mt-6 flex flex-col justify-center">
          <label className="self-start text-black">Email</label>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-black bg-white px-2 text-black"
            type="email"
            placeholder="mail@gmail.com"
          />
          <label className="mt-5 self-start text-black">Password</label>
          <input
            className="mt-2 h-12 w-full rounded-2xl border border-black bg-white px-2 text-black"
            type="password"
            placeholder="********"
          />
          {/* Find a darker color for hover */}
          <button className="bg-primary mx-auto my-4 h-12 w-28 rounded-3xl text-white shadow-2xl hover:bg-violet-900">
            Login
          </button>
        </form>
        <div className="mx-auto flex justify-center">
          <p className="text-black">Don&apos;t have an account? </p>
          <p className="text-primary ms-1 hover:text-violet-900">Register</p>
        </div>
      </section>
    </main>
  );
};

export default Login;
