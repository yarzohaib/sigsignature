"use client";

import React, { useState } from "react";
import HelpHero from "@/components/help/HelpHero";
import CategoryCards from "@/components/help/CategoryCards";
import PopularGuides from "@/components/help/PopularGuides";
import QuickAnswers from "@/components/help/QuickAnswers";
import SupportBanner from "@/components/help/SupportBanner";

export default function HelpContent() {
  const [searchQuery] = useState("");

  return (
    <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10 2xl:px-12 w-full">
      <main className="flex flex-col gap-8 sm:gap-10 w-full pb-10">
        {/* 1. Hero */}
        <HelpHero />

        {/* 2. Category Cards */}
        <CategoryCards />

        {/* 3. Popular Guides & Quick Answers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <PopularGuides searchQuery={searchQuery} />
          <QuickAnswers />
        </div>

        {/* 4. Support Banner */}
        <SupportBanner />
      </main>
    </div>
  );
}
