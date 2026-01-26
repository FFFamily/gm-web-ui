import { createPinia } from 'pinia'

// Export a single Pinia instance so router guards/directives can safely access stores.
export const pinia = createPinia()

