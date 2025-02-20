import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { MembersList } from "@/features/member/components/MembersList";

async function MembersPage() {
  const user = getCurrent();
  if (!user) return redirect("/sign-in");

  return (
    <div className="w-full max-w-xl">
      <MembersList />
    </div>
  );
}

export default MembersPage;
