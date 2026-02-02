/**
 * Server-side Analytics Exports
 *
 * These exports use Node.js APIs and should only be imported in:
 * - API routes
 * - Server components
 * - getServerSideProps / getStaticProps
 *
 * DO NOT import this file in client components.
 */

// Types (safe for both client and server)
export * from './types';

// Storage operations (requires fs module)
export {
  logPageView,
  logEvent,
  logConversion,
  getPageViews,
  getEvents,
  getConversions,
  getRecommendations,
  saveRecommendations,
  updateRecommendationStatus,
  saveABTest,
  getABTests,
  getABTestById,
  getStore,
  clearStore,
  exportData,
  importData,
} from './storage';

// Monitor functions
export {
  aggregatePageViews,
  getTopPages,
  calculateBounceRate,
  calculateAvgSessionDuration,
  aggregateEventsByCategory,
  getTopEvents,
  aggregateConversionsByType,
  calculateConversionRate,
  analyzeFunnel,
  calculateUserMetrics,
  calculatePerformanceMetrics,
  generateMetricsSummary,
  calculateTrends,
  checkAlerts,
  generateInsights,
} from './monitor';

// Improvements
export {
  generateRecommendations,
  getImprovementTemplate,
  createABTest,
  assignVariant,
  recordVariantView,
  recordVariantConversion,
  calculateSignificance,
  determineWinner,
  suggestABTests,
  improvementTemplates,
} from './improvements';
