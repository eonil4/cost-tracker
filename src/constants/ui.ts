/**
 * UI constants for consistent styling across the application
 * Follows DRY principle - centralizes UI-related constants
 */

// Tile dimensions
export const TILE_HEIGHT = 452;

// DataGrid dimensions
export const DATA_GRID_HEIGHT = 380;
export const DATA_GRID_MIN_WIDTH = 540;

// Column widths for DataGrid
export const COLUMN_WIDTHS = {
  DESCRIPTION: 200,
  AMOUNT: 120,
  CURRENCY: 100,
  DATE: 120,
  ACTIONS: 100,
} as const;

// Spacing constants
export const SPACING = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  EXTRA_LARGE: 4,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
