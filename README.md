# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## E2E 40 failed tests:
```js
    [chromium] › test\e2e\app.spec.ts:243:3 › Cost Tracker Application › should display summary charts     
    [chromium] › test\e2e\responsive.spec.ts:111:3 › Responsive Design › should handle summary charts on mobile
    [chromium] › test\e2e\time-period-selectors.spec.ts:38:3 › Time Period Selectors › should navigate to current month when clicking Current Month button
    [chromium] › test\e2e\time-period-selectors.spec.ts:57:3 › Time Period Selectors › should change week selection and update daily costs
    [chromium] › test\e2e\time-period-selectors.spec.ts:81:3 › Time Period Selectors › should change month selection and update weekly costs
    [chromium] › test\e2e\time-period-selectors.spec.ts:104:3 › Time Period Selectors › should change year selection and update monthly costs
    [chromium] › test\e2e\time-period-selectors.spec.ts:127:3 › Time Period Selectors › should display empty state when no expenses for selected period
    [firefox] › test\e2e\app.spec.ts:243:3 › Cost Tracker Application › should display summary charts      
    [firefox] › test\e2e\app.spec.ts:286:3 › Cost Tracker Application › should persist data in localStorage

    [firefox] › test\e2e\responsive.spec.ts:111:3 › Responsive Design › should handle summary charts on mobile
    [firefox] › test\e2e\time-period-selectors.spec.ts:38:3 › Time Period Selectors › should navigate to current month when clicking Current Month button
    [firefox] › test\e2e\time-period-selectors.spec.ts:57:3 › Time Period Selectors › should change week selection and update daily costs
    [firefox] › test\e2e\time-period-selectors.spec.ts:81:3 › Time Period Selectors › should change month selection and update weekly costs
    [firefox] › test\e2e\time-period-selectors.spec.ts:104:3 › Time Period Selectors › should change year selection and update monthly costs
    [firefox] › test\e2e\time-period-selectors.spec.ts:127:3 › Time Period Selectors › should display empty state when no expenses for selected period
    [webkit] › test\e2e\app.spec.ts:243:3 › Cost Tracker Application › should display summary charts       
    [webkit] › test\e2e\responsive.spec.ts:111:3 › Responsive Design › should handle summary charts on mobile
    [webkit] › test\e2e\time-period-selectors.spec.ts:38:3 › Time Period Selectors › should navigate to current month when clicking Current Month button
    [webkit] › test\e2e\time-period-selectors.spec.ts:57:3 › Time Period Selectors › should change week selection and update daily costs
    [webkit] › test\e2e\time-period-selectors.spec.ts:81:3 › Time Period Selectors › should change month selection and update weekly costs
    [webkit] › test\e2e\time-period-selectors.spec.ts:104:3 › Time Period Selectors › should change year selection and update monthly costs
    [webkit] › test\e2e\time-period-selectors.spec.ts:127:3 › Time Period Selectors › should display empty state when no expenses for selected period
    [Mobile Chrome] › test\e2e\app.spec.ts:125:3 › Cost Tracker Application › should delete an expense     
    [Mobile Chrome] › test\e2e\app.spec.ts:154:3 › Cost Tracker Application › should filter expenses by currency
    [Mobile Chrome] › test\e2e\app.spec.ts:243:3 › Cost Tracker Application › should display summary charts

    [Mobile Chrome] › test\e2e\responsive.spec.ts:111:3 › Responsive Design › should handle summary charts on mobile
    [Mobile Chrome] › test\e2e\time-period-selectors.spec.ts:38:3 › Time Period Selectors › should navigate to current month when clicking Current Month button
    [Mobile Chrome] › test\e2e\time-period-selectors.spec.ts:57:3 › Time Period Selectors › should change week selection and update daily costs
    [Mobile Chrome] › test\e2e\time-period-selectors.spec.ts:81:3 › Time Period Selectors › should change month selection and update weekly costs
    [Mobile Chrome] › test\e2e\time-period-selectors.spec.ts:104:3 › Time Period Selectors › should change year selection and update monthly costs
    [Mobile Chrome] › test\e2e\time-period-selectors.spec.ts:127:3 › Time Period Selectors › should display empty state when no expenses for selected period
    [Mobile Safari] › test\e2e\app.spec.ts:125:3 › Cost Tracker Application › should delete an expense     
    [Mobile Safari] › test\e2e\app.spec.ts:154:3 › Cost Tracker Application › should filter expenses by currency
    [Mobile Safari] › test\e2e\app.spec.ts:243:3 › Cost Tracker Application › should display summary charts

    [Mobile Safari] › test\e2e\responsive.spec.ts:111:3 › Responsive Design › should handle summary charts on mobile
    [Mobile Safari] › test\e2e\time-period-selectors.spec.ts:38:3 › Time Period Selectors › should navigate to current month when clicking Current Month button
    [Mobile Safari] › test\e2e\time-period-selectors.spec.ts:57:3 › Time Period Selectors › should change week selection and update daily costs
    [Mobile Safari] › test\e2e\time-period-selectors.spec.ts:81:3 › Time Period Selectors › should change month selection and update weekly costs
    [Mobile Safari] › test\e2e\time-period-selectors.spec.ts:104:3 › Time Period Selectors › should change year selection and update monthly costs
    [Mobile Safari] › test\e2e\time-period-selectors.spec.ts:127:3 › Time Period Selectors › should display empty state when no expenses for selected period
```
