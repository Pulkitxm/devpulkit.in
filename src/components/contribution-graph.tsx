"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GITHUB_START_CONTRIBUTION_YEAR, TODAY } from "@/lib/config";
import { CONTRIBUTION } from "@/types/github";
import { getGithubContributionData } from "@/lib/gh";
import { Skeleton } from "@/components/ui/skeleton";

export function ContributionGraph() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [data, setData] = useState<CONTRIBUTION | null>(null);
  const [loading, setLoading] = useState(false);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchYearData = async (year: number) => {
    setLoading(true);
    try {
      const newData = await getGithubContributionData(year);
      if (newData) setData(newData);
    } catch (error) {
      console.error("Failed to fetch year data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = async (year: number) => {
    setSelectedYear(year);
  };

  const getContributionColor = (count: number) => {
    if (count === 0) return "bg-zinc-900 dark:bg-zinc-800";
    if (count <= 3) return "bg-emerald-300 dark:bg-emerald-900";
    if (count <= 6) return "bg-emerald-500 dark:bg-emerald-700";
    return "bg-emerald-700 dark:bg-emerald-500";
  };

  const processedData = (() => {
    if (!data) return { weeks: [] };

    const weeks: typeof data.contributions.weeks = [];
    const firstDate =
      data.contributions.weeks[0]?.contributionDays[0]?.timeStamp;

    if (!firstDate) return { weeks };

    const startDate = new Date(firstDate);
    const dayOfWeek = startDate.getDay();

    if (dayOfWeek > 0) {
      const firstWeek = {
        contributionDays: Array(dayOfWeek).fill({
          contributionCount: 0,
          date: "",
        }),
      };

      data.contributions.weeks[0]?.contributionDays.forEach((day) => {
        firstWeek.contributionDays.push(day);
      });

      weeks.push(firstWeek);
      weeks.push(...data.contributions.weeks.slice(1));
    } else {
      weeks.push(...data.contributions.weeks);
    }

    return { weeks };
  })();

  const monthPositions = processedData.weeks.reduce<number[]>(
    (acc, week, weekIndex) => {
      week.contributionDays.forEach((day) => {
        if (day.timeStamp) {
          const date = new Date(day.timeStamp);
          if (date.getDate() === 1) {
            acc[date.getMonth()] = weekIndex;
          }
        }
      });
      return acc;
    },
    Array(12).fill(0),
  );

  useEffect(() => {
    fetchYearData(selectedYear);
  }, [selectedYear]);

  return (
    <div className="container mx-auto px-4">
      <Card className="w-full overflow-hidden rounded-xl bg-white dark:bg-zinc-900">
        <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-xl font-bold sm:text-2xl">
              GitHub Contributions
            </CardTitle>
            <div className="flex items-center gap-2 self-center rounded-full bg-white/10 p-1 sm:self-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-white/20 hover:text-white"
                onClick={() => handleYearChange(selectedYear - 1)}
                disabled={
                  loading || selectedYear <= GITHUB_START_CONTRIBUTION_YEAR
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <AnimatePresence mode="wait">
                <motion.span
                  key={selectedYear}
                  className="min-w-[4rem] text-center text-lg font-medium"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedYear}
                </motion.span>
              </AnimatePresence>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-white hover:bg-white/20 hover:text-white"
                onClick={() => handleYearChange(selectedYear + 1)}
                disabled={loading || selectedYear >= currentYear}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="mb-2 hidden sm:flex">
                {months.map((month, index) => (
                  <div
                    key={month}
                    className="text-xs text-muted-foreground"
                    style={{
                      width: "14px",
                      marginLeft:
                        index === 0 ? `${monthPositions[0] * 14}px` : 0,
                      marginRight:
                        index < 11
                          ? `${(monthPositions[index + 1] - monthPositions[index] - 1) * 14}px`
                          : 0,
                    }}
                  >
                    {loading ? <Skeleton className="h-4 w-8" /> : month}
                  </div>
                ))}
              </div>

              <div className="h-[94px] sm:h-[120px]">
                {" "}
                {/* Fixed height container */}
                {loading ? (
                  <div className="flex gap-[2px]">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="flex flex-col gap-1 sm:gap-[2px]"
                      >
                        {Array.from({ length: 7 }).map((_, dayIndex) => (
                          <Skeleton
                            key={`${weekIndex}-${dayIndex}`}
                            className="h-[11px] w-[11px] rounded-sm sm:h-[14px] sm:w-[14px]"
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedYear}
                      className="flex gap-[2px]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      {data?.contributions.weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className="flex flex-col gap-1 sm:gap-[2px]"
                        >
                          {week.contributionDays.map(
                            (day, dayIndex) =>
                              day.timeStamp.getDate() <= TODAY.getDate() && (
                                <motion.div
                                  key={`${weekIndex}-${dayIndex}`}
                                  className={`h-[11px] w-[11px] rounded-sm sm:h-[14px] sm:w-[14px] ${
                                    day.timeStamp.toDateString() ===
                                    TODAY.toDateString()
                                      ? "bg-orange-500 dark:bg-orange-700"
                                      : ""
                                  } ${getContributionColor(day.contributionCount)}`}
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{
                                    duration: 0.5,
                                    delay: (weekIndex * 7 + dayIndex) * 0.001,
                                  }}
                                  title={
                                    day.timeStamp
                                      ? TODAY.toDateString() ===
                                        day.timeStamp.toDateString()
                                        ? "Let me contribute today :)"
                                        : `${new Date(day.timeStamp).toLocaleDateString("en-GB")}: ${
                                            day.contributionCount
                                          } contribution${
                                            day.contributionCount !== 1
                                              ? "s"
                                              : ""
                                          }`
                                      : "No data"
                                  }
                                />
                              ),
                          )}
                        </div>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start justify-between gap-4 border-t pt-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Less</span>
                <div className="flex gap-1">
                  <div className="h-[11px] w-[11px] rounded-sm bg-zinc-900 dark:bg-zinc-800 sm:h-[14px] sm:w-[14px]" />
                  <div className="h-[11px] w-[11px] rounded-sm bg-emerald-300 dark:bg-emerald-900 sm:h-[14px] sm:w-[14px]" />
                  <div className="h-[11px] w-[11px] rounded-sm bg-emerald-500 dark:bg-emerald-700 sm:h-[14px] sm:w-[14px]" />
                  <div className="h-[11px] w-[11px] rounded-sm bg-emerald-700 dark:bg-emerald-500 sm:h-[14px] sm:w-[14px]" />
                </div>
                <span>More</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                {loading ? (
                  <>
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-36" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center rounded-full">
                      <span>
                        Total Contributions:{" "}
                        {data?.contributions.totalContributions}
                      </span>
                    </div>
                    {data?.prs !== null && (
                      <div className="flex items-center rounded-full py-1">
                        <span>
                          Total Merged PRs: {data?.prs.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
