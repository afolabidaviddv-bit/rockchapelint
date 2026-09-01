import { useEffect, useState } from "react";
import { ImagePlus, Music2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMediaAssets, MEDIA_DEFAULTS, uploadMedia, type MediaAsset } from "@/admin/media";
import { toast } from "sonner";
import { handleImageError } from "@/lib/image-fallback";

const defaults = [
  ["homeHero", "Home hero", "image", MEDIA_DEFAULTS.homeHero],
  ["about", "About Us", "image", MEDIA_DEFAULTS.about],
  ["directions", "Get Directions", "image", MEDIA_DEFAULTS.directions],
  ["logo", "Header and footer logo", "logo", MEDIA_DEFAULTS.logo],
  ["founder", "Founder portrait", "image", MEDIA_DEFAULTS.founder],
  ["gallery1", "Gallery: Sunday worship", "image", MEDIA_DEFAULTS.gallery1],
  ["gallery2", "Gallery: Worship team", "image", MEDIA_DEFAULTS.gallery2],
  ["gallery3", "Gallery: Children's church", "image", MEDIA_DEFAULTS.gallery3],
  ["gallery4", "Gallery: Prayer gathering", "image", MEDIA_DEFAULTS.gallery4],
  ["sermonAudio", "Sermon audio", "audio", ""],
] as const;

export function MediaCatalog() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const load = () => void getMediaAssets().then(setAssets);
  useEffect(load, []);

  return (
    <Card className="mt-6 rounded-2xl border-border/70 p-5 shadow-soft sm:p-6">
      <div><h2 className="font-display text-xl font-semibold text-navy">Website media</h2><p className="mt-1 text-sm leading-6 text-muted-foreground">Replace public images and sermon audio from your phone. Defaults stay available as a safe fallback.</p></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {defaults.map(([key, label, kind, fallback]) => {
          const asset = assets.find((item) => item.key === key);
          const url = asset?.url || fallback;
          return <div key={key} className="rounded-xl border border-border/70 p-3">
            <div className="flex items-center gap-3">{kind === "audio" ? <Music2 className="size-5 text-gold" /> : <ImagePlus className="size-5 text-gold" />}<div className="min-w-0"><p className="truncate text-sm font-medium text-navy">{label}</p><p className="text-xs text-muted-foreground">{asset ? "Custom replacement" : "Default media"}</p></div></div>
            {kind === "audio" ? <audio controls className="mt-3 w-full" src={url || undefined} /> : <img src={url} onError={handleImageError} alt={asset?.alt_text || label} className="mt-3 h-28 w-full rounded-lg object-cover" />}
            <Input className="mt-3 h-12 cursor-pointer rounded-xl pt-3" type="file" accept={kind === "audio" ? "audio/*" : "image/*"} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; try { await uploadMedia(file, key, label, kind); toast.success(`${label} replaced`); load(); } catch { toast.error("Upload failed. Please try again."); } event.target.value = ""; }} />
          </div>;
        })}
      </div>
    </Card>
  );
}
