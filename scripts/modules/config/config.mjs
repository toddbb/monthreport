/*********************************************************************/
/*                           Config Module                           */
/*********************************************************************/
const $AppName = "MyApp";

// Detect environment and set base URL
function $getBaseUrl() {
   const host = window.location.hostname;

   if (host === "localhost" || host === "127.0.0.1") {
      return "http://localhost:5500"; // or whatever your local server port is
   } else if (host.endsWith("github.io")) {
      return `https://${host}/${$AppName.toLowerCase()}`; // replace with your actual GitHub repo name
   } else {
      return window.location.origin; // default fallback
   }
}

export const Config = {
   DEV_MODE: false,
   API_URL: $getBaseUrl(), // TO DO: change this for production
   APP_NAME: $AppName, // TO DO: Change this to your app name
   APP_NAME_LOWERCASE: $AppName.toLowerCase(),
   SESSION_STORAGE_PREFIX: $AppName.toLowerCase(), // TO DO: Change this to a unique prefix for this app
};
