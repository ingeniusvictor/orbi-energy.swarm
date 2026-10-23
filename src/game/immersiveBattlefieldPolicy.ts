import type { ViewportCompositionProfile } from "./viewportComposition";

type ImmersiveViewport = Pick<ViewportCompositionProfile,
  "orientation" | "touchControlsRecommended" | "coarsePointer" | "width" | "height">;

/** Layout-only selection. Native Android touch gating is unchanged.
 * Browser desktop/laptop fine-pointer landscapes share UX01/UX02's
 * panoramic Canvas and compact HUD; portrait retains its previous shell. */
export const projectImmersiveBattlefieldMode = (profile: ImmersiveViewport) => {
  const touchLandscape = profile.orientation === "LANDSCAPE" &&
    profile.touchControlsRecommended;
  const webLandscape = profile.orientation === "LANDSCAPE" &&
    !profile.coarsePointer && profile.width >= 800 && profile.height >= 360;
  return {
    touchLandscape,
    webLandscape,
    immersive: touchLandscape || webLandscape,
  };
};
