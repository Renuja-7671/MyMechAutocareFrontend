/**
 * WheelsDoc AutoCare Branding Constants
 * Centralized branding configuration for the application
 */

export const BRANDING = {
  // Application name
  APP_NAME: 'WheelsDoc AutoCare',
  APP_NAME_SHORT: 'WheelsDoc',
  
  // Tagline
  TAGLINE: 'Vehicle Service Management',
  
  // Logo
  LOGO_PATH: 'figma:asset/1e334aef77be8b1884333118e444c25de1ffa1e9.png',
  
  // Contact information
  SUPPORT_EMAIL: 'support@wheelsdoc.com',
  ADMIN_EMAIL: 'admin@wheelsdoc.com',
  
  // Social/Website
  WEBSITE: 'https://wheelsdoc.com',
  
  // Founded year
  ESTABLISHED_YEAR: '2025',
  
  // Colors (matching your logo)
  COLORS: {
    primary: '#4ECCA3', // Green from logo
    secondary: '#293462', // Navy/purple from logo
    accent: '#F4A261', // Orange from logo
  },
} as const;

// Helper to get full app title
export const getAppTitle = (subtitle?: string) => {
  if (subtitle) {
    return `${BRANDING.APP_NAME} - ${subtitle}`;
  }
  return BRANDING.APP_NAME;
};

// Helper to get year range
export const getYearRange = () => {
  const currentYear = new Date().getFullYear().toString();
  if (currentYear === BRANDING.ESTABLISHED_YEAR) {
    return BRANDING.ESTABLISHED_YEAR;
  }
  return `${BRANDING.ESTABLISHED_YEAR} - ${currentYear}`;
};
