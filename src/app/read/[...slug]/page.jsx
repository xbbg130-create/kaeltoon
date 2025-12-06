"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchChapterContent } from "@/lib/api";
import { saveReadingHistory } from "@/lib/readingHistory";
import { ChevronLeft, ChevronRight, RotateCcw, BookOpen } from "lucide-react";
import Image from "next/image";

// --- PERUBAHAN DIMULAI DI SINI ---

// Custom Image Component dengan Lazy Loading & IntersectionObserver
const PageImage = ({ src, alt, index, onImageLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    // Inisialisasi observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen masuk ke viewport, set state dan berhenti mengamati
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      {
        // Mulai loading 300px sebelum gambar masuk layar
        // agar pengguna tidak melihat loading saat scroll cepat
        rootMargin: "300px 0px",
      }
    );

    // Mulai mengamati elemen ref
    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    // Cleanup observer saat komponen unmount
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, []); // Array dependensi kosong, hanya berjalan sekali

  return (
    <div
      ref={imageRef}
      className="w-full relative"
      style={{ minHeight: isInView ? 'auto' : '500px' }}
    >
      {isInView ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <Image
            src={hasError ? "/placeholder.png" : src}
            alt={alt}
            width={800}
            height={1000}
            className={`w-full h-auto transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            style={{ display: 'block' }}
            onLoad={() => {
              setIsLoading(false);
              if (onImageLoad) {
                onImageLoad();
              }
            }}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
            priority={index < 3}
            unoptimized
          />
        </>
      ) : (
        <Skeleton className="w-full" style={{ height: '500px' }} />
      )}
    </div>
  );
};

// --- PERUBAHAN BERAKHIR DI SINI ---


export default function ReaderPage() {
  const { slug } = useParams(); // This will be [chapterSlug] (single slug parameter)
  const router = useRouter();
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentComicSlug, setCurrentComicSlug] = useState(null);
  const [currentChapterSlug, setCurrentChapterSlug] = useState(null);
  const [loadedImagesCount, setLoadedImagesCount] = useState(0);

  useEffect(() => {
    if (slug && slug.length > 0) {
      // Join all parts of the slug to form the complete chapter slug
      const chapterSlug = slug.join('/');

      setCurrentChapterSlug(chapterSlug);

      const getChapterContent = async () => {
        try {
          setLoading(true);
          const data = await fetchChapterContent(chapterSlug);
          setChapterData(data);
          setError(null);

          // Extract comic slug from chapter slug - typically the part before the chapter number
          const extractedComicSlug = chapterSlug.replace(/-chapter-\d+.*$/, '').replace(/-chapter-\d+$/, '');
          setCurrentComicSlug(extractedComicSlug);

          // Save reading history to localStorage
          saveReadingHistory({
            comicSlug: extractedComicSlug,
            chapterSlug: chapterSlug,
            mangaTitle: data.manga_title,
            chapterTitle: data.chapter_title,
          });

          // Reset loaded images count when new chapter data is set
          setLoadedImagesCount(0);
        } catch (err) {
          setError(err);
          console.error("Error fetching chapter content:", err);
        } finally {
          setLoading(false);
        }
      };

      getChapterContent();

      // Reset loaded images count when chapter changes
      setLoadedImagesCount(0);
    }
  }, [slug]);

  const navigateToChapter = (chapterSlug) => {
    router.push(`/read/${currentComicSlug}/${chapterSlug}`);
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Failed to load chapter</h2>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Button onClick={() => router.back()}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-96" />
          ))}
        </div>
      </div>
    );
  }

  if (!chapterData) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Chapter not found</h2>
        <Button asChild>
          <Link href="/">
            <RotateCcw className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }

  const { manga_title, chapter_title, images, navigation } = chapterData;
  const prevChapterSlug = navigation?.previousChapter;
  const nextChapterSlug = navigation?.nextChapter;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold line-clamp-1">{manga_title}</h1>
          <h2 className="text-lg text-muted-foreground">{chapter_title}</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {prevChapterSlug && (
            <Button asChild variant="outline">
              <Link href={`/read/${prevChapterSlug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Link>
            </Button>
          )}

          {navigation?.chapterList && (
            <Button asChild variant="outline">
              <Link href={`/comic/${currentComicSlug}`}>
                <BookOpen className="h-4 w-4 mr-2" />
                Chapters
              </Link>
            </Button>
          )}

          {nextChapterSlug && (
            <Button asChild variant="outline">
              <Link href={`/read/${nextChapterSlug}`}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Progress indicator */}
      {images && images.length > 0 && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(loadedImagesCount / images.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-1">
            {loadedImagesCount} / {images.length} pages loaded
          </div>
        </div>
      )}

      {/* Images container - break out of parent padding */}
      <div
        className="relative w-screen left-1/2 -translate-x-1/2 sm:w-full sm:left-0 sm:translate-x-0"
      >
        {images && images.length > 0 ? (
          <>
            {images.map((image, index) => (
              <PageImage
                key={index}
                src={image}
                alt={`Page ${index + 1}`}
                index={index}
                onImageLoad={() => setLoadedImagesCount(prev => prev + 1)}
              />
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No pages available for this chapter.</p>
          </div>
        )}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button asChild variant="outline">
          <Link href={`/comic/${currentComicSlug}`}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Comic
          </Link>
        </Button>

        <div className="flex gap-2">
          {prevChapterSlug && (
            <Button asChild>
              <Link href={`/read/${prevChapterSlug}`}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous Chapter
              </Link>
            </Button>
          )}

          {nextChapterSlug && (
            <Button asChild>
              <Link href={`/read/${nextChapterSlug}`}>
                Next Chapter
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}