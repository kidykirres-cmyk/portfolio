// Backward compatibility — centralized service lives in src/services/api.js
// All components currently import from '../api' — this re-exports the real service
export * from './services/api.js'
export { default } from './services/api.js'
