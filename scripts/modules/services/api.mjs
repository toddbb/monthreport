/*********************************************************************/
/*                           API Module                              */
/*********************************************************************/

const _fetchWithTimeout = (url, options, timeout) => {
   const fetchPromise = fetch(url, options);

   if (timeout) {
      const timeoutPromise = new Promise((resolve, reject) => {
         setTimeout(() => {
            reject(new Error("Request timed out"));
         }, timeout);
      });

      return Promise.race([fetchPromise, timeoutPromise]);
   } else {
      return fetchPromise;
   }
};

export async function Get(url, settings) {
   /// default settings to null if it doesn't exist
   settings = settings || {};

   /// create options object; set defaults, if not set
   let options = {
      method: "GET",
   };

   /// for readability, create variable for functions and any other data
   const timeout = settings.timeout;

   return _fetchWithTimeout(url, options, timeout)
      .then((response) => {
         if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
      })
      .then((data) => data)
      .catch((error) => {
         throw error;
      });
}

export async function Post(url, payload, settings) {
   /// default settings to null if it doesn't exist
   settings = settings || {};

   /// create options object; set defaults, if not set
   let options = {
      method: "POST",
      headers: settings.headers || typeof payload === "object" ? { "Content-type": "application/json" } : { "Content-type": "text/xml" },
      body: typeof payload === "object" ? JSON.stringify(payload) : payload,
   };

   /// for readability, create variable for functions and any other data
   const timeout = settings.timeout;

   return _fetchWithTimeout(url, options, timeout)
      .then((response) => {
         if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
         }
         return response.json();
      })
      .then((data) => data)
      .catch((error) => {
         throw error;
      });
}
