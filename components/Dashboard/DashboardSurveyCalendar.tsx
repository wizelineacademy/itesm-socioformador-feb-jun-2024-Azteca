"use client";

import React from "react";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import InfoToolTip from "@/components/InfoToolTip";

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

const DashboardSurveyCalendar: React.FC<SurveyCalendarProps> = ({
  completedSurveys,
}) => (
  <div className="flex w-fit flex-col rounded-xl bg-white px-10 py-5 drop-shadow-lg">
    <InfoToolTip
      description='Each indicator shows a survey type answered:<br /><span style="display: flex; align-items: center; gap: 0;"><span style="display: inline-block; width: 10px; height: 10px; background-color: #0063FF; border-radius: 50%; margin-right: 5px;"></span>RULER Survey</span><span style="display: flex; align-items: center; gap: 0;"><span style="display: inline-block; width: 10px; height: 10px; background-color: #2BDD66; border-radius: 50%; margin-right: 5px;"></span>Sprint Sprint</span><span style="display: flex; align-items: center; gap: 0;"><span style="display: inline-block; width: 10px; height: 10px; background-color: #fc8a08; border-radius: 50%; margin-right: 5px;"></span>Project Survey</span>'
      size="md"
    />

    <Calendar
      className="px-2"
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

export default DashboardSurveyCalendar;
