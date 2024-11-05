import ThemeToggle from "@/components/ThemeToggle";
import dynamic from "next/dynamic";

const Mail = dynamic(
  () => {
    return import("@/components/mail/Mail");
  },
  {
    ssr: false,
  },
);

const page = () => {
  return (
    <div>
      <div className="absolute bottom-4 left-2">
        <ThemeToggle />
      </div>
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </div>
  );
};

export default page;
