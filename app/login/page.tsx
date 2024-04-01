import Image from "next/image";

const Login = () => {
  return (
    <main className="w-full h-dvh bg-gradient-to-r from-primary to-[#8671d3] flex items-center justify-center">
      <section className="bg-white w-[459px] h-[80%] rounded-[20px] shadow-md">
        <p className=" text-center text-black text-4xl leading-tight font-medium mt-10 mx-8">
          Welcome to Feedback Flow
        </p>
        <Image
          className="my-6 mx-auto px-3 border border-black rounded-lg hover:bg-gray-300"
          src="/slack.svg"
          alt="slack-logo"
          width={65}
          height={20}
        />
        <div className="flex items-center justify-center mx-12">
          <div className="flex-grow border-t border-black"></div>
          <span className="mx-4 text-black text-sm">OR</span>
          <div className="flex-grow border-t border-black"></div>
        </div>
        <form className="flex flex-col items-center justify-center mt-6">
          <label className="text-black text-sm">Email</label>
          <input
            className="w-[80%] h-10 border bg-white text-black border-black rounded-lg px-2 my-2"
            type="email"
          />
        </form>
      </section>
    </main>
  );
};

export default Login;
