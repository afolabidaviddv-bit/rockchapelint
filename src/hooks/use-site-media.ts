import { useEffect, useState } from "react";
import { getMediaAssets, MEDIA_DEFAULTS, type MediaAsset } from "@/admin/media";
import { supabaseConfigured } from "@/admin/auth";

export function useSiteMedia() {
  const [assets, setAssets] = useState<Record<string, MediaAsset>>({});
  useEffect(() => {
    let active = true;
    if (supabaseConfigured) {
      void getMediaAssets()
        .then((rows) => {
          if (active) setAssets(Object.fromEntries(rows.map((row) => [row.key, row])));
        })
        .catch(() => {
          if (active) setAssets({});
        });
    }
    return () => { active = false; };
  }, []);
  return {
    homeHero: assets.homeHero?.url || MEDIA_DEFAULTS.homeHero,
    about: assets.about?.url || MEDIA_DEFAULTS.about,
    directions: assets.directions?.url || MEDIA_DEFAULTS.directions,
    logo: assets.logo?.url || MEDIA_DEFAULTS.logo,
    assets,
  };
}
