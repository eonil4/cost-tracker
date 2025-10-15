/**
 * UI constants for consistent styling across the application
 * Follows DRY principle - centralizes UI-related constants
 */

// Tile dimensions - calculated to fit DataGrid with 4 visible rows, scrollbar for 5+ rows, and horizontal scrollbar space
// Tile height: 484px, Paper padding: 48px (24px top + 24px bottom), Typography: 48px
// Available content area: 484px - 48px - 48px = 388px
export const TILE_HEIGHT = 484;

// DataGrid dimensions - calculated to show 4 rows initially with scrollbar for 5+ rows + 16px for horizontal scrollbar
// Header: 56px, Toolbar: 56px, 4 rows: 208px, Pagination: 52px, Horizontal scrollbar: 16px = 388px
export const DATA_GRID_HEIGHT = 388;
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
