/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://scholarspoint.net',
  generateRobotsTxt: true,

  // Exclude admin and auth pages
  exclude: ['/admin/*', '/auth/*', '/login', '/signup', '/forgot-password', '/reset-password'],

  // Generate index sitemap for better performance with large sites
  generateIndexSitemap: true,

  // Default change frequency and priority
  changefreq: 'daily',
  priority: 0.7,

  // Custom robot rules
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://scholarspoint.net/sitemap-opportunities.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/auth', '/api'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
    ],
  },

  // Transform function to set priority based on path
  transform: async (config, path) => {
    // High priority for main pages
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      };
    }

    // High priority for category listing pages
    const categoryPages = [
      '/scholarships',
      '/internships',
      '/fellowships',
      '/competitions',
      '/conferences',
      '/workshops',
      '/exchange_programs',
      '/online_courses',
      '/jobs',
      '/blogs',
      '/visa-guides',
    ];

    if (categoryPages.includes(path)) {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      };
    }

    // Medium priority for static pages
    const staticPages = ['/about', '/contact', '/privacy', '/terms'];
    if (staticPages.includes(path)) {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      };
    }

    // Default for other pages
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    };
  },

  // Additional paths that might not be discovered automatically
  additionalPaths: async (config) => {
    const result = [];

    // Add main category pages
    const categories = [
      'scholarships',
      'internships',
      'fellowships',
      'competitions',
      'conferences',
      'workshops',
      'exchange_programs',
      'online_courses',
      'jobs',
    ];

    for (const category of categories) {
      result.push({
        loc: `/${category}`,
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      });
    }

    return result;
  },
};
