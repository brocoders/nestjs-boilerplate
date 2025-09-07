export const CmcApiConfig = {
  listings: '/v1/cryptocurrency/listings/latest', // Returns the latest listings of cryptocurrencies with market data such as price, volume, and market cap.
  info: '/v1/cryptocurrency/info', // Provides detailed metadata about a cryptocurrency, including its description, logo, and official website.
  quotes: '/v1/cryptocurrency/quotes/latest', // Retrieves the latest market quotes for specified cryptocurrencies, including price, volume, and percentage changes.
  map: '/v1/cryptocurrency/map', // Returns a mapping of cryptocurrency IDs to their symbols and names, useful for reference and lookup.
  marketPairs: '/v1/cryptocurrency/market-pairs/latest', // Provides the latest market pairs for a cryptocurrency, including exchange data and trading pairs.
  categories: '/v1/cryptocurrency/categories', // Lists all cryptocurrency categories and their associated data.
  category: '/v1/cryptocurrency/category', // Returns detailed information about a specific cryptocurrency category.
  trendingGainersLosers: '/v1/cryptocurrency/trending/gainers-losers', // Provides data on cryptocurrencies that are trending as top gainers or losers over a recent period.
  trendingRecentlyAdded: '/v1/cryptocurrency/trending/recently-added', // Lists cryptocurrencies that have been recently added to the market and are trending.
  trendingMostViewed: '/v1/cryptocurrency/trending/most-viewed', // Returns cryptocurrencies that are currently the most viewed on the platform.
  trendingMostVisited: '/v1/cryptocurrency/trending/most-visited', // Provides data on cryptocurrencies with the highest number of visits or views.
  trendingMostActive: '/v1/cryptocurrency/trending/most-active', // Lists cryptocurrencies with the highest trading activity or volume.
  trendingMostVolatile: '/v1/cryptocurrency/trending/most-volatile', // Returns cryptocurrencies exhibiting the most price volatility in the recent period.
  trendingRecentlyAddedGainers:
    '/v1/cryptocurrency/trending/recently-added/gainers', // Provides data on recently added cryptocurrencies that are gaining value.
  trendingRecentlyAddedLosers:
    '/v1/cryptocurrency/trending/recently-added/losers', // Lists recently added cryptocurrencies that are losing value.
  trendingGainers: '/v1/cryptocurrency/trending/gainers', // Returns cryptocurrencies that are currently gaining value.
  trendingLosers: '/v1/cryptocurrency/trending/losers', // Provides data on cryptocurrencies that are currently losing value.
};
