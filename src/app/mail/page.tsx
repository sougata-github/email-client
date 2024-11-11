import ComposeButton from "@/components/mail/ComposeButton";
import ThemeToggle from "@/components/ThemeToggle";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader } from "lucide-react";
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
    <div className="relative">
      <div className="absolute bottom-4 left-2">
        <div className="my-2 flex flex-col items-center gap-2">
          <ComposeButton />
          <ThemeToggle />
          <ClerkLoading>
            <Loader className="size-4 animate-spin" />
          </ClerkLoading>
          <ClerkLoaded>
            <div className="flex items-center justify-center rounded-full border-2 border-black/20 shadow dark:border-white/80">
              <UserButton />
            </div>
          </ClerkLoaded>
        </div>
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
