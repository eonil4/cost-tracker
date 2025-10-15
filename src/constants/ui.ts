/**
 * UI constants for consistent styling across the application
 * Follows DRY principle - centralizes UI-related constants
 */

// Tile dimensions - calculated to fit DataGrid with 5 rows perfectly
// DataGrid height (448px) + Typography height (~48px) + Padding (24px) = 520px
export const TILE_HEIGHT = 520;

// DataGrid dimensions - calculated for exactly 5 rows
// Header: 56px, Rows: 5 * 52px = 260px, Toolbar: 56px, Pagination: 52px, Padding: 24px
export const DATA_GRID_HEIGHT = 448; // 56 + 260 + 56 + 52 + 24
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
