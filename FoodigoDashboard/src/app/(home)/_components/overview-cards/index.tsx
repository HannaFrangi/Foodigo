import { compactFormat } from "@/lib/format-number";
import { getOverviewData } from "../../fetch";
import { OverviewCard } from "./card";
import * as icons from "./icons";

// API response interface
interface ApiResponse {
  success: boolean;
  data: {
    categories: number;
    ingredients: number;
    recipes: number;
    areas: number;
    users: number;
  };
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

export async function OverviewCardsGroup() {
  // Fetch data with proper typing
  const stats = (await getOverviewData()) as OverviewStats;

  // Define card configurations
  const cards = [
    {
      label: "Total Recipes",
      data: {
        ...stats.recipes,
        value: stats.recipes?.value ? compactFormat(stats.recipes.value) : "0",
      },
      Icon: icons.Views,
    },
    {
      label: "Total Ingredients",
      data: {
        ...stats.ingredients,
        value: stats.ingredients?.value
          ? compactFormat(stats.ingredients.value)
          : "0",
      },
      Icon: icons.Profit,
    },
    {
      label: "Total Categories",
      data: {
        ...stats.categories,
        value: stats.categories?.value
          ? compactFormat(stats.categories.value)
          : "0",
      },
      Icon: icons.Product,
    },
    {
      label: "Total Users",
      data: {
        ...stats.users,
        value: stats.users?.value ? compactFormat(stats.users.value) : "0",
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
