import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { SignInCard } from "@/features/auth/components/SignInCard";

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) {
    redirect("/");
  }

  return (
    <div className="h-full w-full">
      <SignInCard />
    </div>
  );
};

export default SignInPage;
