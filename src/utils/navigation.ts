import type { NavigateFunction } from "react-router";

let navigateFn: NavigateFunction | null = null;

export const setNavigate = (nav: NavigateFunction) => {
  navigateFn = nav;
};

export const globalNavigate = (path: string, options?: { state?: unknown }) => {
  if (navigateFn) {
    navigateFn(path, options);
  } else {
    window.location.href = path;
  }
};