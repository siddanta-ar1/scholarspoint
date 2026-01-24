export default function ScholarshipsLoading() {
    return (
        <main className="container mx-auto px-4 py-16">
            {/* Header skeleton */}
            <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
                <div className="inline-flex p-4 bg-gray-100 rounded-[24px] mb-2 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
                <div className="h-12 bg-gray-100 rounded-xl max-w-lg mx-auto animate-pulse" />
                <div className="h-6 bg-gray-100 rounded-lg max-w-md mx-auto animate-pulse" />
            </div>

            {/* Cards skeleton grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse"
                    >
                        <div className="h-48 bg-gray-200" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 rounded w-1/3" />
                            <div className="h-5 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="flex justify-between pt-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-6 bg-gray-200 rounded w-1/3" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
