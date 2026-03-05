import { Config } from "../config/config.mjs";
import * as Utils from "./utils.mjs";

export const Debug = {
   body: null,

   init() {
      this.body = document.querySelector("body");
      // create debug element
      const options = {
         classes: ["debugBug"],
         parent: this.body,
         textContent: "🪲",
      };

      let elementDebug = Utils.createElement("div", options);

      Utils.setStyles(elementDebug, {
         position: "fixed",
         bottom: "10px",
         right: "10px",
         cursor: "pointer",
         zIndex: "9999",
         fontSize: "1.5vw",
         userSelect: "none",
      });

      elementDebug.style.setProperty("outline", "none", "important");
      elementDebug.style.setProperty("background", "transparent", "important");

      elementDebug.addEventListener("click", () => {
         this.body.classList.toggle("debugger");
      });
   },

   log(msg) {
      if (Config.DEV_MODE) {
         Utils.log(`${msg}`, Utils.ENUM.LOG.DEBUG);
      }
   },

   logTable(obj) {
      Utils.logTable(obj, Utils.ENUM.LOG.DEBUG);
   },

   logBox(el) {
      const rect = el.getBoundingClientRect();
      console.table({
         width: rect.width,
         height: rect.height,
         top: rect.top,
         left: rect.left,
         margin: getComputedStyle(el).margin,
         padding: getComputedStyle(el).padding,
         border: getComputedStyle(el).border,
      });
   },

   highlight(el, color = "red") {
      el.style.setProperty("outline", `2px solid ${color}`, "important");
   },

   randomBg(el) {
      const color = `hsl(${Math.random() * 360}, 70%, 70%)`;
      el.style.setProperty("background-color", color, "important");
      console.log("Applied bg:", color);
   },

   logParents(el) {
      const parents = [];
      let cur = el;
      while (cur) {
         parents.push(cur.tagName.toLowerCase() + (cur.id ? "#" + cur.id : ""));
         cur = cur.parentElement;
      }
      console.log(parents.join(" → "));
   },

   logChildren(el) {
      [...el.children].forEach((child) => {
         const rect = child.getBoundingClientRect();
         console.log(child.tagName, "w:", rect.width, "h:", rect.height);
      });
   },
};
