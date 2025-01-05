"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, GitPullRequest } from "lucide-react";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GITHUB_DEFAULT_VIEW_YEAR,
  GITHUB_START_CONTRIBUTION_YEAR,
  IGNORED_CONTRIBUTION_YEARS,
  TODAY
} from "@/lib/config";
import { months } from "@/lib/constants";
import { getGithubContributionData } from "@/lib/gh";
import { CONTRIBUTION } from "@/types/github";

import { MonthGrid } from "./MonthGrid";
import { YearSelector } from "./YearSelector";

export function ContributionGraph(): React.ReactElement {
  const currentYear = TODAY.getFullYear();
  const [data, setData] = useState<Record<number, CONTRIBUTION>>({});
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [selectedYear, setSelectedYear] = useState(GITHUB_DEFAULT_VIEW_YEAR);
  const [highlightedDate, setHighlightedDate] = useState<Date | null>(null);

  const fetchYearData = useCallback(
    async (year: number) => {
      if (data[year]) return;

      try {
        setLoading(true);
        const newData = await getGithubContributionData(year);
        if (newData) {
          setData((prevData) => ({ ...prevData, [year]: newData }));
          setAnimating(true);
          setTimeout(() => setAnimating(false), 1500);
        }
      } catch (error) {
        console.error("Failed to fetch year data:", error);
      } finally {
        setLoading(false);
      }
    },
    [data]
  );

  useEffect(() => {
    fetchYearData(selectedYear);
  }, [selectedYear, fetchYearData]);

  const handleJumpToToday = useCallback(() => {
    const today = new Date();
    setSelectedYear(today.getFullYear());
    setHighlightedDate(today);

    setTimeout(() => setHighlightedDate(null), 1000);
  }, []);

  const availableYears = useMemo(() => {
    return Array.from({ length: currentYear - GITHUB_START_CONTRIBUTION_YEAR + 1 }, (_, i) => currentYear - i).filter(
      (year) => !IGNORED_CONTRIBUTION_YEARS.includes(year)
    );
  }, [currentYear]);

  const selectedYearData = data[selectedYear];

  return (
    <Card className="w-full max-w-full border-zinc-700 bg-black/60 shadow-xl backdrop-blur-md md:max-w-6xl">
      <CardHeader className="border-b border-zinc-700 px-4 py-3 md:px-6">
        <CardTitle className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
          <span className="text-xl font-bold text-zinc-100 md:text-2xl">GitHub Contributions</span>
          <div className="flex items-center space-x-2">
            <YearSelector selectedYear={selectedYear} onYearChange={setSelectedYear} availableYears={availableYears} />
            <Button onClick={handleJumpToToday} variant="outline" size="sm">
              Today
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          <div className="-mx-4 overflow-x-auto pb-4 md:mx-0">
            <div className="flex min-w-max px-4 py-2 md:px-0">
              {months.map((month, index) => (
                <div key={month} className="flex flex-col" style={{ minWidth: "70px" }}>
                  <div className="mb-2 px-1 text-center text-[10px] font-medium text-zinc-400 md:text-xs">{month}</div>
                  <MonthGrid
                    year={selectedYear}
                    month={index}
                    contributions={selectedYearData?.contributions.months[index]?.days || []}
                    isLoading={loading}
                    isAnimating={animating}
                    highlightedDate={highlightedDate}
                  />
                </div>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={loading ? "loading" : "loaded"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-start justify-between space-y-2 rounded-lg bg-zinc-800/50 p-3 md:flex-row md:items-center md:space-y-0 md:p-4"
            >
              {loading ? (
                <>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-36" />
                </>
              ) : (
                selectedYearData && (
                  <>
                    <div className="flex items-center space-x-2 text-xs text-zinc-300 md:text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
                      <span>
                        <strong>{selectedYearData.contributions.totalContributions}</strong> contributions in{" "}
                        {selectedYearData.year}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-zinc-300 md:text-sm">
                      <GitPullRequest className="h-4 w-4 text-emerald-400 md:h-5 md:w-5" />
                      <span>
                        <strong>{selectedYearData.prs}</strong> Pull Requests
                      </span>
                    </div>
                  </>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}