"use client";

import { useEffect, useMemo, useState } from "react";
import { Trash2, ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ImageItem = { id: string; url: string; name: string };

export default function ImagesPage() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<ImageItem | null>(null);

  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/dashboard/add-image");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setImages(data.images);
      } catch {
        toast.error("Impossible de charger les images");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const uploadImage = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/dashboard/add-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de l'ajout");
        return;
      }
      setImages((prev) => [data.image, ...prev]);
      setFile(null);
      toast.success("Image ajoutée");
    } catch {
      toast.error("Erreur lors de l'ajout");
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const res = await fetch(`/api/dashboard/add-image?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setImages((prev) => prev.filter((image) => image.id !== id));
      toast.success("Image supprimée");
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <div className="pt-15 w-full flex flex-col items-center gap-6 px-4 pb-10">
      <h1 className="text-xl font-primary text-white">Ajouter une image</h1>

      <div className="flex flex-col items-center gap-3">
        <label className="flex h-40 w-55 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/40 bg-border/40 text-white/70 hover:bg-border/60 overflow-hidden">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus className="size-6" />
              <span className="text-sm">Choisir une image</span>
            </>
          )}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        <Button onClick={uploadImage} disabled={!file || uploading}>
          {uploading ? "Envoi en cours..." : "Envoyer"}
        </Button>
      </div>

      <div className="w-full max-w-4xl">
        {loading ? (
          <p className="text-center text-sm text-white/60">Chargement...</p>
        ) : images.length === 0 ? (
          <p className="text-center text-sm text-white/60">Aucune image pour le moment.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <li key={image.id} className="group relative aspect-square overflow-hidden rounded-xl bg-border/40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
                <button
                  onClick={() => setImageToDelete(image)}
                  aria-label="Supprimer l'image"
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white"
                >
                  <Trash2 color="white" className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog
        open={imageToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setImageToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;image</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;image sera définitivement supprimée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (imageToDelete) deleteImage(imageToDelete.id);
                setImageToDelete(null);
              }}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
