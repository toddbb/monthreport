import { Config } from "./modules/config/config.mjs";
import * as Utils from "./modules/utilities/utils.mjs";

/**
 * Function: init
 *
 * Initializes the DOM after it is loaded
 */
const initAfterDOM = () => {
   Utils.log("Initializing application after DOM load", Utils.ENUM.LOG.INIT);

   if (Config.DEV_MODE) {
      import("./modules/utilities/debug.mjs").then(({ Debug }) => {
         Debug.init();
         window.Config = Config;
         window.Utils = Utils;
         window.Debug = Debug;
      });
   }
};

/**
 * Function: init
 * Initializes before the DOM is loaded
 */
const init = () => {
   Utils.log("Initializing application before DOM load", Utils.ENUM.LOG.INIT);
};

document.addEventListener("DOMContentLoaded", () => initAfterDOM());
init();
