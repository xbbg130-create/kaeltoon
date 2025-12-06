"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { fetchLatestComics } from "@/lib/api";

export default function HomePage() {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const comicsPerPage = 20; // Number of comics to load per request

  useEffect(() => {
    const getLatestComics = async () => {
      try {
        setLoading(true);
        const result = await fetchLatestComics({
          page: 1,
          per_page: comicsPerPage
        });

        // Handle response structure - check if it contains pagination info or just comics array
        if (result.comics) {
          // Response contains pagination object
          setComics(result.comics || []);
          setHasMore(result.pagination?.has_more || false);
        } else {
          // Response is just an array of comics
          setComics(result || []);
          setHasMore(false); // Default to no more if no pagination info
        }
      } catch (error) {
        console.error("Error fetching latest comics:", error);
      } finally {
        setLoading(false);
      }
    };

    getLatestComics();
  }, []);

  const loadMoreComics = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const result = await fetchLatestComics({
        page: nextPage,
        per_page: comicsPerPage
      });

      let newComics = [];
      let hasMoreResult = false;

      if (result.comics) {
        // Response contains pagination object
        newComics = result.comics || [];
        hasMoreResult = result.pagination?.has_more || false;
      } else {
        // Response is just an array of comics
        newComics = result || [];
        hasMoreResult = false; // Default to no more if no pagination info
      }

      setComics(prev => [...prev, ...newComics]);
      setHasMore(hasMoreResult);
      setPage(nextPage);
    } catch (error) {
      console.error("Error fetching more comics:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Latest Updates</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: comicsPerPage }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-48" />
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {comics.length > 0 ? (
              comics.map((comic, index) => {
                // Bersihkan slug dengan menghapus "manga/"
                const cleanSlug = comic.link.replace("manga/", "");

                return (
                  <Link href={`/comic/${cleanSlug}`} key={index}>
                    <Card className="overflow-hidden hover:opacity-90 transition-opacity">
                      <img
                        src={comic.image}
                        alt={comic.title}
                        className="w-full h-64 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{comic.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {comic.chapter ? `${comic.chapter}` : "No chapters"}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })
            ) : (
              <p className="col-span-full text-center py-8 text-muted-foreground">
                No comics found.
              </p>
            )}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <Button
                onClick={loadMoreComics}
                disabled={loadingMore}
                className="px-6 py-2"
              >
                {loadingMore ? "Loading more..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}