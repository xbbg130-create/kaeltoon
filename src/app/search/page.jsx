import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-12">Loading search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}