import { useCallback, useEffect, useRef, useState } from "react";
import { ImageIcon, Loader2, Trash2, UploadCloud, FileAudio } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { removeMedia, resolveMediaUrl, uploadMedia } from "@/admin/media";

export function useMediaUrl(value: unknown) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    let active = true;
    void resolveMediaUrl(value).then((u) => active && setUrl(u));
    return () => {
      active = false;
    };
  }, [value]);
  return url;
}

export function MediaThumb({
  value,
  className,
  alt,
}: {
  value: unknown;
  className?: string;
  alt: string;
}) {
  const url = useMediaUrl(value);
  if (!url) {
    return (
      <span
        className={cn(
          "grid place-items-center rounded-xl bg-muted text-muted-foreground",
          className,
        )}
        aria-hidden
      >
        <ImageIcon className="size-4" />
      </span>
    );
  }
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={cn("rounded-xl object-cover", className)}
    />
  );
}

export function MediaUpload({
  value,
  onChange,
  folder = "uploads",
  accept = "image/*",
  label = "image",
  help,
}: {
  value: string;
  onChange: (value: string) => void;
  folder?: string;
  accept?: string;
  label?: string;
  help?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const previewUrl = useMediaUrl(value);
  const isAudioVideo = accept.includes("audio") || accept.includes("video");

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      const file = files?.[0];
      if (!file) return;
      if (file.size > 20 * 1024 * 1024) {
        toast.error("That file is larger than 20 MB. Please choose a smaller one.");
        return;
      }
      setBusy(true);
      setProgress(10);
      try {
        const ref = await uploadMedia(file, folder, setProgress);
        onChange(ref);
        toast.success("Upload complete");
      } catch {
        toast.error("Upload failed. Please try again.");
      } finally {
        setBusy(false);
        setProgress(0);
      }
    },
    [folder, onChange],
  );

  const clear = async () => {
    const current = value;
    onChange("");
    try {
      await removeMedia(current);
    } catch {
      /* file already gone */
    }
  };

  if (value && !busy) {
    return (
      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-muted/30 p-3">
        {isAudioVideo ? (
          <span className="grid size-20 place-items-center rounded-xl bg-navy text-primary-foreground">
            <FileAudio className="size-6" />
          </span>
        ) : (
          <MediaThumb value={value} alt={`Uploaded ${label}`} className="size-20" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{value.split("/").pop()}</p>
          <p className="text-xs text-muted-foreground">
            {previewUrl ? "Ready to use on the website" : "Preparing preview…"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => inputRef.current?.click()}
          >
            Replace
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full text-destructive hover:text-destructive"
            onClick={() => void clear()}
          >
            <Trash2 className="size-4" /> Remove
          </Button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        void handleFiles(e.dataTransfer.files);
      }}
      className={cn(
        "rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200",
        dragging ? "border-gold bg-gold/10" : "border-border bg-muted/30 hover:border-gold/60",
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center gap-2 focus-visible:outline-none"
      >
        <span className="grid size-12 place-items-center rounded-2xl bg-navy text-primary-foreground">
          {busy ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
        </span>
        <span className="text-sm font-medium">
          {busy ? "Uploading…" : `Drag & drop your ${label} here`}
        </span>
        <span className="text-xs text-muted-foreground">
          {help ?? "or click to browse — JPG, PNG or WEBP up to 20 MB"}
        </span>
      </button>
      {busy ? <Progress value={progress} className="mt-4 h-1.5" /> : null}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />
    </div>
  );
}
