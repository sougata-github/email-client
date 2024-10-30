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
      <Mail
        defaultLayout={[20, 32, 48]}
        defaultCollapsed={false}
        navCollapsedSize={4}
      />
    </div>
  );
};

export default page;
