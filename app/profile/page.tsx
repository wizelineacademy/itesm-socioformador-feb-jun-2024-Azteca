import NavigationBar from "@/components/NavigationBar";
import UserProfileButton from "@/components/UserProfileButton";
import CoWorkersCarousel from "@/components/CoWorkersCarousel";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import Tooltip from "@/components/Tooltip";
import Badge from "@/components/Badge";
import Image from "next/image";
import JobSVG from "@/public/Job-Profile-Image.svg";

const Profile = () => {
  const userName = "Adrián Alejandro Ramírez Cruz";
  const userEmail = "adrian_rmzc@gmail.com";
  const userRole = "Software Engineer";
  const userDepartment = "IT Department";

  const Strengths = [
    "Detail Attention",
    "Good Communication",
    "Punctuallity",
    "Creative",
    "Discipline",
    "Proactive",
  ];
  const oportunityAreas = [
    "Lack of Communication",
    "Ineffective Time Management",
    "Bad Work Team",
    "Procrastination",
  ];

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
          <div className="mb-6">
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium">Co-workers</h3>
              <p className="text-grayText cursor-pointer self-center text-sm">
                Show More
              </p>
            </div>
            <div className="mt-2">
              <CoWorkersCarousel />
            </div>
          </div>
          {/* Projects */}
          <div>
            <div className="mx-auto flex justify-between">
              <h3 className="text-2xl font-medium">Projects</h3>
              <p className="text-grayText cursor-pointer self-center text-sm">
                Show More
              </p>
            </div>
            <div className="mt-2 flex gap-4">
              <ProjectsCarousel />
              {/* <ProjectCard /> */}
            </div>
          </div>
        </div>

        <div className="w-5/12">
          {/* Strenghts */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium">Strengths</h3>
            <p className="text-grayText cursor-pointer self-center text-sm">
              Show More
            </p>
          </div>
          <div className="mb-10 mt-5 flex flex-wrap gap-5">
            {Strengths.map((strength, index) => (
              <Tooltip message="Lorem ipsum dolor sit amet" key={index}>
                <Badge text={strength} />
              </Tooltip>
            ))}
          </div>
          {/* Oportunity Areas */}
          <div className="mx-auto flex justify-between">
            <h3 className="text-2xl font-medium">Oportunity Areas</h3>
            <p className="text-grayText cursor-pointer self-center text-sm">
              Show More
            </p>
          </div>
          <div className="mb-10 mt-5 flex flex-wrap gap-5">
            {oportunityAreas.map((area, index) => (
              <Tooltip message="Lorem ipsum dolor sit amet" key={index}>
                <Badge text={area} />
              </Tooltip>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
