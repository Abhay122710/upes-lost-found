/**
 * API Configuration
 * 
 * Toggle USE_SPRING_BOOT to true and set SPRING_BOOT_BASE_URL
 * when you want to switch from Supabase to a Java Spring Boot backend.
 */

export const API_CONFIG = {
  USE_SPRING_BOOT: false,
  SPRING_BOOT_BASE_URL: import.meta.env.VITE_SPRING_BOOT_API_URL || 'http://localhost:8080/api',
};
