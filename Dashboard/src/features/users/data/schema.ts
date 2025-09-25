import { z } from 'zod';

// const groceryItemSchema = z.object({
//   _id: z.string(),
//   ingredientID: z.string(),
//   quantity: z.string(),
//   isPurchased: z.boolean(),
//   lastUpdated: z.coerce.date(),
// });

const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  isVerified: z.boolean(),
  isAdmin: z.boolean(),
  isActive: z.boolean(),
  ProfilePicURL: z.string().default(''),
  recipeFavorites: z.array(z.string()),
  createdAt: z.coerce.date(),
  // groceryList: z.array(groceryItemSchema),
  __v: z.number(),
});

export type User = z.infer<typeof userSchema>;
// export type GroceryItem = z.infer<typeof groceryItemSchema>;

export const userListSchema = z.array(userSchema);
