"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSearchResults } from "@/lib/api";

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const searchComics = async () => {
        try {
          setLoading(true);
          const data = await fetchSearchResults(query);
          setResults(data || []);
        } catch (error) {
          console.error("Error searching comics:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      searchComics();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Search Results for "{query}"
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 10 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <Skeleton className="w-full h-40 sm:h-48" />
              <CardContent className="p-3 sm:p-4">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((comic) => (
            <Link href={`/comic/${comic.slug}`} key={comic.slug}>
              <Card className="overflow-hidden hover:opacity-90 transition-opacity">
                <img
                  src={comic.thumbnail || "/placeholder.png"}
                  alt={comic.title}
                  className="w-full h-40 sm:h-48 object-cover"
                  onError={(e) => {
                    e.target.src = "/placeholder.png";
                  }}
                />
                <CardContent className="p-3 sm:p-4">
                  <h3 className="font-semibold truncate text-sm sm:text-base">{comic.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                    {comic.description ? `${comic.description}` : "No Description"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            {query ? `No results found for "${query}"` : "Enter a search term to begin"}
          </p>
        </div>
      )}
    </div>
  );
}