'use client'

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"

type ImageItem = { id: string; url: string; name: string }

export default function GalleryPage({
  initialImages,
  initialHasMore,
}: {
  initialImages: ImageItem[]
  initialHasMore: boolean
}) {

  const t = useTranslations('gallery')
  const [images, setImages] = useState<ImageItem[]>(initialImages)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/gallery?skip=${images.length}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setImages((prev) => [...prev, ...data.images])
      setHasMore(data.hasMore)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center pt-10 pb-10 px-4 w-full">
      <div className="flex flex-col justify-center items-center text-white">
        <h1 className="font-third text-[50px] text-shadow-[4px_6px_8px_rgba(0,0,0,0.5)]">{t('title')}</h1>
        <h3 className="font-second text-[50px] -translate-y-12">{t('subtitle')}</h3>
      </div>

      {images.length === 0 ? (
        <p className="text-center text-sm text-white/80">{t('empty')}</p>
      ) : (
        <div className="w-full max-w-4xl columns-2 sm:columns-3 md:columns-4 gap-4 -translate-y-5">
          {images.map((image) => (
            <div key={image.id} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-border/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.url} alt={image.name} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      )}

      {hasMore && (
        <Button
          onClick={loadMore}
          disabled={loading}
          className="rounded-full bg-white/70 text-text hover:bg-white/90 h-[45px] px-6"
        >
          {loading ? t('loading') : t('loadMore')}
        </Button>
      )}
    </div>
  )
}
