export type CollectionResponse = {
  id: number;
  name: string;
  symbol: string;
  family?: string;
  description?: string;
  imageUrl?: string;
  createdAt?: number; // timestamp
  isDerived: boolean;
  discordUrl?: string;
  twitterUrl?: string;
  websiteUrl?: string;
  totalItems?: number;
  // categories: string[];
};
