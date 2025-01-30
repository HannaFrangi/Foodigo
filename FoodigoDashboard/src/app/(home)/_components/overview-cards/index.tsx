"use client";
import { useState, useEffect } from "react";
import { compactFormat } from "@/lib/format-number";
import { OverviewCard } from "./card";
import * as icons from "./icons";
import { Skeleton } from "@/components/ui/skeleton";

async function getOverviewData() {
  try {
    const response = await fetch("https://foodigo.onrender.com/api/admin", {
      method: "GET",
      credentials: "include", // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Transform the API data to match the required format
    const transformedData = {
      categories: {
        value: result.data.categories,
        growthRate: 0,
      },
      ingredients: {
        value: result.data.ingredients,
        growthRate: 0,
      },
      recipes: {
        value: result.data.recipes,
        growthRate: 0,
      },
      users: {
        value: result.data.users,
        growthRate: 0,
      },
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    // Return default values in case of error
    return {
      categories: {
        value: 0,
        growthRate: 0,
      },
      ingredients: {
        value: 0,
        growthRate: 0,
      },
      recipes: {
        value: 0,
        growthRate: 0,
      },
      users: {
        value: 0,
        growthRate: 0,
      },
    };
  }
}

// Stats data interface
interface StatsData {
  value: number | null;
  growthRate: number;
}

// Props interface for overview cards
interface OverviewStats {
  recipes: StatsData;
  ingredients: StatsData;
  categories: StatsData;
  users: StatsData;
}

export function OverviewCardsGroup() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getOverviewData();
      setStats(data as OverviewStats);
      setLoading(false);
    };

    fetchData();
  }, []);

  // If still loading, return a loading state (spinner or message)
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
          >
            <Skeleton className="size-12 rounded-full" />

            <div className="mt-6 flex items-end justify-between">
              <div>
                <Skeleton className="mb-1.5 h-7 w-18" />

                <Skeleton className="h-5 w-20" />
              </div>

              <Skeleton className="h-5 w-15" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Define card configurations
  const cards = [
    {
      label: "Total Recipes",
      data: {
        ...stats?.recipes,
        value: stats?.recipes?.value ? compactFormat(stats.recipes.value) : "0",
      },
      Icon: icons.Views,
    },
    {
      label: "Total Ingredients",
      data: {
        ...stats?.ingredients,
        value: stats?.ingredients?.value
          ? compactFormat(stats.ingredients.value)
          : "0",
      },
      Icon: icons.Profit,
    },
    {
      label: "Total Categories",
      data: {
        ...stats?.categories,
        value: stats?.categories?.value
          ? compactFormat(stats.categories.value)
          : "0",
      },
      Icon: icons.Product,
    },
    {
      label: "Total Users",
      data: {
        ...stats?.users,
        value: stats?.users?.value ? compactFormat(stats.users.value) : "0",
      },
      Icon: icons.Users,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      {cards.map((card) => (
        <OverviewCard
          key={card.label}
          label={card.label}
          data={card.data}
          Icon={card.Icon}
        />
      ))}
    </div>
  );
}
