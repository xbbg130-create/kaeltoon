"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getReadingHistory, removeFromHistory, clearReadingHistory } from "@/lib/readingHistory";
import { BookOpen, Trash2, Clock, ChevronRight } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function HistoryPage() {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        type: null, // 'clear-all' or 'remove-item'
        itemSlug: null,
    });

    useEffect(() => {
        // Load history from localStorage
        const loadHistory = () => {
            const historyData = getReadingHistory();
            setHistory(historyData);
            setLoading(false);
        };

        loadHistory();
    }, []);

    const handleRemoveItem = (comicSlug) => {
        setConfirmDialog({
            open: true,
            type: 'remove-item',
            itemSlug: comicSlug,
        });
    };

    const handleClearAll = () => {
        setConfirmDialog({
            open: true,
            type: 'clear-all',
            itemSlug: null,
        });
    };

    const handleConfirm = () => {
        if (confirmDialog.type === 'clear-all') {
            clearReadingHistory();
            setHistory([]);
        } else if (confirmDialog.type === 'remove-item' && confirmDialog.itemSlug) {
            removeFromHistory(confirmDialog.itemSlug);
            setHistory(getReadingHistory());
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return "Just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Reading History</h1>
                        <p className="text-muted-foreground">
                            {history.length > 0
                                ? `You have read ${history.length} manga${history.length > 1 ? 's' : ''}`
                                : "No reading history yet"}
                        </p>
                    </div>
                    {history.length > 0 && (
                        <Button variant="destructive" onClick={handleClearAll}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
                    <BookOpen className="h-24 w-24 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-semibold mb-2">No Reading History</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        Start reading some manga to see your reading history here. Your progress will be automatically saved.
                    </p>
                    <Button asChild>
                        <Link href="/">
                            Browse Manga
                        </Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card key={item.comicSlug} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row gap-4 p-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold mb-1 line-clamp-1">
                                                    {item.mangaTitle}
                                                </h3>
                                                <p className="text-muted-foreground mb-2 line-clamp-1">
                                                    {item.chapterTitle}
                                                </p>
                                                <div className="flex items-center text-sm text-muted-foreground mb-4">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {formatDate(item.timestamp)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <Button asChild size="sm">
                                                <Link href={`/read/${item.chapterSlug}${item.lastPage ? `?page=${item.lastPage}` : ''}`}>
                                                    Continue Reading
                                                    <ChevronRight className="h-4 w-4 ml-1" />
                                                </Link>
                                            </Button>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/comic/${item.comicSlug}`}>
                                                    <BookOpen className="h-4 w-4 mr-1" />
                                                    View Manga
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.comicSlug)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                onConfirm={handleConfirm}
                title={confirmDialog.type === 'clear-all' ? 'Clear All History?' : 'Remove from History?'}
                description={
                    confirmDialog.type === 'clear-all'
                        ? 'This will permanently delete all your reading history. This action cannot be undone.'
                        : 'This manga will be removed from your reading history. You can always add it back by reading it again.'
                }
                confirmText={confirmDialog.type === 'clear-all' ? 'Clear All' : 'Remove'}
                cancelText="Cancel"
                variant="destructive"
            />
        </div>
    );
}
