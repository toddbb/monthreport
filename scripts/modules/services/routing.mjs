import { Config } from "../config/config.mjs";

/**
 * Minimal hash-based router for simple SPAs
 * Usage:
 *   import { initRouter, navigate } from './router.mjs';
 *   initRouter({ home: showHome, game: showGame });
 */

let routes = {};
let currentView = null;

/**
 * Initialize the router with your view functions
 * @param {Object} routeMap - Object mapping route names to handler functions
 * @param {string} defaultRoute - Default route (default: 'home')
 */
export function initRouter(routeMap, defaultRoute = "home") {
   routes = routeMap;

   // console.log("Router initialized with routes:", Object.keys(routes));
   // console.log(routes);

   // Listen for hash changes
   window.addEventListener("hashchange", handleRouteChange);

   // Handle initial load
   handleRouteChange();
}

/**
 * Handle route changes
 */
function handleRouteChange() {
   const hash = window.location.hash.slice(1) || "home";
   const route = hash.split("/")[0]; // Get first part (e.g., 'game' from '#game/123')

   // console.log(`Navigating to route: ${route}`);

   if (routes[route]) {
      currentView = route;
      routes[route]();
   } else if (routes.home) {
      // Fallback to home if route not found
      window.location.hash = "home";
   }
}

/**
 * Navigate to a route programmatically
 * @param {string} route - Route name (e.g., 'game', 'home')
 */
export function navigate(route) {
   console.log(`Programmatically navigating to route: ${route}`);
   window.location.hash = route;
}

/**
 * Get current route name
 * @returns {string} Current route
 */
export function getCurrentRoute() {
   return currentView;
}

if (Config.DEV_MODE) {
   import("../utilities/debug.mjs").then(({ Debug }) => {
      window.Routes = routes;
      window.currentView = currentView;
   });
}
