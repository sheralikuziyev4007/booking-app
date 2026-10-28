import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL = { screen: "booking", step: 1 };
const sameNav = (a, b) => a.screen === b.screen && a.step === b.step;

// Keeps the current screen/step in the browser history, so the browser's and the phone's
// Back/Forward buttons move between booking steps instead of leaving the site.
//
// `resolve(target, current)` decides where a Back/Forward press may land and returns the nav
// to show — for example step 1 when the selected date no longer exists. It may also return
// `arrive`, a callback run in the same update as the step change (to reset or clear state
// without rendering the old step with half-cleared data). When going back lands on an entry
// that changes nothing (a step of an already finished booking), it is skipped.
export function useHistoryNav(resolve) {
  const [nav, setNav] = useState(INITIAL);
  const navRef = useRef(nav);
  // Position in the history stack: tells Back from Forward on popstate
  const indexRef = useRef(0);
  const resolveRef = useRef(resolve);
  resolveRef.current = resolve;

  useEffect(() => {
    // After a reload the current entry keeps its index; the React state starts over from step 1
    indexRef.current = window.history.state?.index ?? 0;
    window.history.replaceState({ ...window.history.state, nav: navRef.current, index: indexRef.current }, "");

    async function onPopState(event) {
      const target = event.state?.nav;
      if (!target) return;
      const index = event.state.index ?? 0;
      const goingBack = index < indexRef.current;
      indexRef.current = index;

      const current = navRef.current;
      const { arrive, ...next } = await resolveRef.current(target, current);

      if (sameNav(next, current) && goingBack) {
        window.history.back();
        return;
      }
      if (!sameNav(next, target)) {
        window.history.replaceState({ ...event.state, nav: next }, "");
      }
      navRef.current = next;
      setNav(next);
      arrive?.();
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Show a new screen/step and record it as a history entry (or overwrite the current one)
  const navigate = useCallback((patch, { replace = false } = {}) => {
    const next = { ...navRef.current, ...patch };
    navRef.current = next;
    setNav(next);
    if (replace) {
      window.history.replaceState({ nav: next, index: indexRef.current }, "");
    } else {
      indexRef.current += 1;
      window.history.pushState({ nav: next, index: indexRef.current }, "");
    }
  }, []);

  const back = useCallback(() => window.history.back(), []);

  return { nav, navigate, back };
}
