import Mail from "@/components/mail/Mail";

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
