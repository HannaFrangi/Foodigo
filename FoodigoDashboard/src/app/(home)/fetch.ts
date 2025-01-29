export async function getOverviewData() {
  try {
    const response = await fetch("http://localhost:5001/api/admin", {
      method: "GET",
      credentials: "include", // Include cookies for authentication
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error("Invalid data received from the server");
    }

    // Calculate growth rates (you might want to fetch historical data for actual calculations)
    // For now, using mock growth rates
    const mockGrowthRates = {
      categories: -0.43,
      ingredients: -4.35,
      recipes: -2.59,
      users: -0.95,
    };

    // Transform the API data to match the required format
    return {
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
  } catch (error) {
    console.error("Error fetching overview data:", error);
    // Return default values in case of error
    return {
      views: {
        value: 0,
        growthRate: 0,
      },
      profit: {
        value: 0,
        growthRate: 0,
      },
      products: {
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

export async function getChatsData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      name: "Jacob Jones",
      profile: "/images/user/user-01.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    },
    {
      name: "Wilium Smith",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "Thanks for the update",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "Johurul Haque",
      profile: "/images/user/user-04.png",
      isActive: false,
      lastMessage: {
        content: "What's up?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
    {
      name: "M. Chowdhury",
      profile: "/images/user/user-05.png",
      isActive: false,
      lastMessage: {
        content: "Where are you now?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 2,
    },
    {
      name: "Akagami",
      profile: "/images/user/user-07.png",
      isActive: false,
      lastMessage: {
        content: "Hey, how are you?",
        type: "text",
        timestamp: "2024-12-19T10:15:00Z",
        isRead: true,
      },
      unreadCount: 0,
    },
  ];
}
