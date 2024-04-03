import NavigationBar from "@/components/NavigationBar";

export default function Home() {
  return (
    <main className="h-dvh w-dvw bg-white">
      <NavigationBar />
      <a href="/login"> Login </a>
    </main>
  );
}
