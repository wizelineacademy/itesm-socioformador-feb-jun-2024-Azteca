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
    <div className={"px-7 pt-10"}>
      <MantineProvider>
        <NavigationBar />
        {children}
      </MantineProvider>
    </div>
  );
}
