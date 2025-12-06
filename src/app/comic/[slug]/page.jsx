"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchComicDetails } from "@/lib/api";
import { ChevronLeft, BookOpen } from "lucide-react";

export default function ComicDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getComicDetails = async () => {
      try {
        const data = await fetchComicDetails(slug);
        setComic(data);
      } catch (error) {
        console.error("Error fetching comic details:", error);
        // Redirect to homepage if comic not found
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      getComicDetails();
    }
  }, [slug, router]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-8">
          <Skeleton className="w-64 h-80" />
          <div className="flex-1 space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Chapters</h2>
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Comic not found</h2>
        <Link href="/">
          <Button>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Link href="/">
        <Button variant="outline" className="mb-6">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row gap-8 w-full">
        <div className="flex justify-center">
          <img
            src={comic.image || "/placeholder.png"}
            alt={comic.title}
            className="w-64 h-80 object-cover rounded-lg shadow-lg"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">{comic.title}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            {comic.metadata?.status && (
              <Badge variant="secondary">{comic.metadata.status}</Badge>
            )}
            {comic.genres && comic.genres.map((genre, index) => (
              <Badge key={index} variant="outline">{genre.name}</Badge>
            ))}
          </div>
          <div className="space-y-4 mb-6">
            {comic.synopsis && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Synopsis</h3>
                <p className="text-muted-foreground whitespace-pre-line">{comic.synopsis}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Author</h4>
                <p>{comic.metadata?.author || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Type</h4>
                <p>{comic.metadata?.type || "N/A"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Status</h4>
                <p>{comic.metadata?.status || "Unknown"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Chapters</h4>
                <p>{comic.chapters?.length || 0}</p>
              </div>
            </div>
          </div>

          {comic.chapters && comic.chapters.length > 0 && (
            <Button asChild className="w-full md:w-auto">
              <Link href={`/read/${comic.chapters[0]?.slug}`}>
                Read Latest Chapter
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Chapters</h2>

        {comic.chapters && comic.chapters.length > 0 ? (
          <div className="space-y-2">
            {[...comic.chapters].reverse().map((chapter) => (
              <Card key={chapter.slug} className="hover:bg-muted transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{chapter.title || `${chapter.chapter || ''}`}</h3>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/read/${chapter.slug}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Read
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No chapters available.</p>
        )}
      </div>
    </div>
  );
}