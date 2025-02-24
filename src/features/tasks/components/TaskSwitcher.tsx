"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DottedSeprator } from "@/components/DottedSeprator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function TaskSwitcher() {
  return (
    <div className="mt-4">
      <Tabs className="border w-full rounded-lg">
        <div className="h-full flex flex-col overflow-auto p-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                Table
              </TabsTrigger>
              <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                Kanban
              </TabsTrigger>
              <TabsTrigger value="calender" className="w-full lg:w-auto h-8">
                Calender
              </TabsTrigger>
            </TabsList>
            <Button className="w-full lg:w-auto" size="sm">
              <PlusIcon className="size-4" />
              New
            </Button>
          </div>

          <DottedSeprator className="py-4" />
          <div>DataFilters</div>
          <DottedSeprator className="py-4" />
          <TabsContent value="table" className="mt-0">
            Data table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data kanban
          </TabsContent>
          <TabsContent value="calender" className="mt-0">
            Data calender
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
