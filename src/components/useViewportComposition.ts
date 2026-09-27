import { useEffect, useState } from "react";

import {
  classifyViewportComposition,
  type ViewportCompositionProfile,
} from "../game/viewportComposition";

const getCoarsePointer = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function"
    ? window.matchMedia("(pointer: coarse)").matches
    : false;

const readViewportProfile = (): ViewportCompositionProfile => {
  if (typeof window === "undefined") {
    return classifyViewportComposition({
      width: 800,
      height: 480,
      coarsePointer: false,
      devicePixelRatio: 1,
    });
  }

  const visualViewport = window.visualViewport;
  return classifyViewportComposition({
    width:
      visualViewport?.width ??
      window.innerWidth,
    height:
      visualViewport?.height ??
      window.innerHeight,
    coarsePointer: getCoarsePointer(),
    devicePixelRatio: window.devicePixelRatio,
  });
};

export const useViewportComposition = () => {
  const [profile, setProfile] =
    useState<ViewportCompositionProfile>(
      readViewportProfile,
    );

  useEffect(() => {
    const coarsePointerQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)")
        : null;

    const refresh = () => {
      setProfile(readViewportProfile());
    };

    window.addEventListener("resize", refresh);
    window.screen.orientation?.addEventListener(
      "change",
      refresh,
    );
    window.visualViewport?.addEventListener(
      "resize",
      refresh,
    );
    coarsePointerQuery?.addEventListener?.(
      "change",
      refresh,
    );

    refresh();

    return () => {
      window.removeEventListener("resize", refresh);
      window.screen.orientation?.removeEventListener(
        "change",
        refresh,
      );
      window.visualViewport?.removeEventListener(
        "resize",
        refresh,
      );
      coarsePointerQuery?.removeEventListener?.(
        "change",
        refresh,
      );
    };
  }, []);

  return profile;
};

export default useViewportComposition;
