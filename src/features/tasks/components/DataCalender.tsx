import {
  format,
  parse,
  startOfWeek,
  getDay,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useMemo, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import { Task } from "../types";

import { EventCard } from "./EventCard";
import { EventToolbar } from "./EventToolbar";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./DataCalender.css";

type Props = {
  data: Task[];
};

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function DataCalender({ data }: Props) {
  const [value, setValue] = useState(
    data?.length ? new Date(data[0]?.dueDate) : new Date()
  );

  const events = useMemo(
    () =>
      data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id,
      })),
    [data]
  );

  function handleNavigate(action: "PREV" | "NEXT" | "TODAY") {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    } else if (action === "NEXT") {
      setValue(addMonths(value, 1));
    } else if (action === "TODAY") {
      setValue(new Date());
    }
  }

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <EventToolbar onNavigate={handleNavigate} value={value} />
        ),
      }}
    />
  );
}
