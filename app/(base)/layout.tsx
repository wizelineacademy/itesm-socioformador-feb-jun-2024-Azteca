import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { MantineProvider } from "@mantine/core";
import NavigationBar from "@/components/NavigationBar";

export default function BaseLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={" w-dvh h-dvh overflow-hidden bg-bone px-7 pb-4 pt-10"}>
      <MantineProvider>
        <NavigationBar />
        {children}
      </MantineProvider>
    </main>
  );
}
