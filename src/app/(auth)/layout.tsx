import { Navbar } from "@/features/auth/components/Navbar";

type Props = {
  children: React.ReactNode;
};

const AuthLayout = ({ children }: Props) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="max-w-screen-2xl mx-auto p-4">
        <Navbar />

        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
