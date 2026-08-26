import {
  CreatorMode,
} from "../config/creator.js";

export function openpacksimulator() {
  sessionStorage.setItem(
    "CreatorMode",
    JSON.stringify(CreatorMode),
  );

  window.location.href =
    "../packsimulator.html";
}

export function backtomainmenu() {
  sessionStorage.setItem(
    "CreatorMode",
    JSON.stringify(CreatorMode),
  );

  window.location.href =
    "../index.html";
}