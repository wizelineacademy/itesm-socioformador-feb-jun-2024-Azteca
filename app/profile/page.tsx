import NavigationBar from "@/components/NavigationBar";
import UserProfileButton from "@/components/UserProfileButton";
import Carousel from "@/components/Carousel";
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
      {/* Banner */}
      <section className="mx-auto mb-24 mt-6 flex h-52 w-[95%] rounded-xl bg-primary">
        <UserProfileButton
          size="lg"
          className="absolute left-20 top-60 h-fit"
          photoUrl="https://static.wikia.nocookie.net/heroe/images/0/08/Lucario_SSBU.png/revision/latest?cb=20200104023610&path-prefix=es"
        />
        <div className="flex w-5/6 flex-row items-center justify-between">
          <div className="ps-56 leading-tight text-white">
            <h2 className=" text-3xl font-semibold">{userName}</h2>
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

      {/* Data */}
      <section className="mx-auto flex w-[95%] justify-between space-x-10">
        <div className="w-7/12">
          {/* Co-workers */}
          <div className="mb-10">
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium">Co-workers</h3>
              <p className="self-center text-sm text-grayText">Show More</p>
            </div>
            <div className="mt-2">
              <Carousel />
            </div>
          </div>
          {/* Projects */}
          <div>
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium">Projects</h3>
              <p className="self-center text-sm text-grayText">Show More</p>
            </div>
          </div>
        </div>

        <div className="w-5/12">
          {/* Strenghts */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium">Strenghs</h3>
            <p className="self-center text-sm text-grayText">Show More</p>
          </div>
          {/* Oportunity Areas */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium">Oportunity Areas</h3>
            <p className="self-center text-sm text-grayText">Show More</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
