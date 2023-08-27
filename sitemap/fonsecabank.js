/**
 * This code initializes Evergage based on the allowed domains and sets up event handling and tracking.
 */

// List of allowed domains for Evergage.
const allowedDomains = ["ddm000000igdvma0-dev-ed.my.site.com"];

// Get the current domain.
domain = window.location.hostname;

// Function to execute when the DOM is ready.
function ready(callback) {
  if (document.readyState != "loading") callback();
  else if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", callback);
  else
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState == "complete") callback();
    });
}

// Execute code when the DOM is ready.
ready(() => {
  // Check if the current domain is in the allowed domains list.
  if (allowedDomains.includes(domain)) {
    // Initialize Evergage with the current domain as the cookie domain.
    Evergage.init({
      cookieDomain: domain,
    }).then(() => {
      const config = {
        // Configuration settings for Evergage events and tracking.
        // ...

        // Define different page types and their associated tracking configurations.
        pageTypes: [
          // Configuration for the home page.
          {
            name: "home_page",
            action: "View Homepage",
            isMatch: () =>
              /^\/fonsecabank\/s\/$/.test(window.location.pathname),
            contentZones: [
              // ...
            ],
          },
          // Configuration for product detail pages.
          {
            name: "product_detail",
            action: "View Product",
            isMatch: () => window.location.pathname.includes("/s/products/"),
            // ...
          },
          // Configuration for article detail pages.
          {
            name: "article_detail",
            action: "View Article",
            isMatch: () => window.location.pathname.includes("/s/articles/"),
            // ...
          },
          // ...
        ],
      };

      let currentUrl = window.location.href;
      let isSitemapInitialized = false;

      // Event listener for user data readiness.
      document.addEventListener("lwc_onuserdataready", (e) => {
        if (isSitemapInitialized) return;

        isSitemapInitialized = true;

        // Catch builder context from Experience Cloud.
        interactionStudioExperienceCloudHelpers.catchBuilderContext();

        // Store user data.
        interactionStudioExperienceCloudHelpers.userData =
          e && e.detail && e.detail.userData;

        // Initialize Evergage sitemap a.
        Evergage.initSitemap(config);
        // SPA Handler which checks the url change and reinitialize the sitemap
        setInterval(() => {
          if (currentUrl !== window.location.href) {
            currentUrl = window.location.href;
            Evergage.reinit();
          }
        }, 1000);
      });
    });
  }
});
