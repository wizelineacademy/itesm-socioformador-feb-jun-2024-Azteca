"use client";

import React from "react";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";

interface SurveyCalendarProps {
  completedSurveys: { date: Date; color: string }[];
}

const dateMatches = (d1: Date, d2: Date): boolean => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

const SurveyCalendar: React.FC<SurveyCalendarProps> = ({
  completedSurveys,
}) => (
  <div className="flex w-fit flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg">
    <Calendar
      renderDay={(date: Date) => {
        const surveysToday = completedSurveys.filter((survey) =>
          dateMatches(survey.date, date),
        );

        return (
          <div
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>{date.getDate()}</div>
            {surveysToday.length > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "24px",
                }}
              >
                {surveysToday.map((survey, index) => (
                  <Indicator
                    key={index}
                    position="bottom-center"
                    size={6}
                    color={survey.color}
                    disabled={false}
                  />
                ))}
              </div>
            )}
          </div>
        );
      }}
    />
  </div>
);

export default SurveyCalendar;
