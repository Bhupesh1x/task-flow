import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

import { UpdateTaskModal } from "@/features/tasks/components/UpdateTaskModal";
import { CreatetaskModal } from "@/features/tasks/components/CreateTaskModal";
import { CreateProjectModal } from "@/features/projects/components/CreateProjectModal";
import { CreateWorkspaceModal } from "@/features/workspace/components/CreateWorkspaceModal";

type Props = {
  children: React.ReactNode;
};

function Dashboardlayout({ children }: Props) {
  return (
    <div className="min-h-screen">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreatetaskModal />
      <UpdateTaskModal />

      <div className="flex h-full w-full">
        <div className="h-full hidden lg:block lg:w-[264px] fixed left-0 top-0 overflow-y-auto">
          <Sidebar />
        </div>

        <div className="h-full lg:pl-[264px] w-full">
          <div className="max-w-screen-2xl mx-auto h-full">
            <Navbar />
            <main className="h-full w-full py-8 px-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboardlayout;
