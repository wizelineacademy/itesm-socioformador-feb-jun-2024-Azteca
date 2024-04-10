import NavigationBar from "@/components/NavigationBar";
import UserProfileButton from "@/components/UserProfileButton";
import Image from "next/image";
import JobSVG from "@/public/Job-Profile-Image.svg";

const Profile = () => {
  const userName = "Adrián Alejandro Ramírez Cruz";
  const userEmail = "adrian_rmzc@gmail.com";
  const userRole = "Software Engineer";
  const userDepartment = "IT Department";
  return (
    <main className=" h-dvh w-dvw overflow-hidden">
      <NavigationBar />
      <section className="mx-auto mt-6 flex h-52 w-[95%] rounded-xl bg-primary">
        <UserProfileButton
          size="lg"
          className="absolute left-20 top-60 h-fit"
          photoUrl="https://static.wikia.nocookie.net/heroe/images/0/08/Lucario_SSBU.png/revision/latest?cb=20200104023610&path-prefix=es"
        />
        <div className="flex w-5/6 flex-row items-center justify-between">
          <div className="ps-56 leading-tight text-white">
            <p className=" text-3xl font-semibold">{userName}</p>
            <div className="flex flex-row items-center gap-2 text-xl">
              <p className="font-medium">{userRole}</p>
              <p className="font-normal">-</p>
              <p className="font-normal">{userDepartment}</p>
            </div>
            <p className="font-light">{userEmail}</p>
          </div>
          <Image src={JobSVG} alt="image" className="hidden md:block" />
        </div>
      </section>
    </main>
  );
};

export default Profile;
