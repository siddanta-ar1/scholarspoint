export default function BlogsLoading() {
    return (
        <main className="container mx-auto px-4 py-16 space-y-12 min-h-screen">
            {/* Header skeleton */}
            <div className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex p-4 bg-gray-100 rounded-[24px] mb-2 animate-pulse">
                    <div className="w-8 h-8 bg-gray-200 rounded" />
                </div>
                <div className="h-14 bg-gray-100 rounded-xl max-w-lg mx-auto animate-pulse" />
                <div className="h-6 bg-gray-100 rounded-lg max-w-md mx-auto animate-pulse" />
            </div>

            {/* Blog cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-[24px] shadow-lg overflow-hidden animate-pulse"
                    >
                        <div className="aspect-video bg-gray-200" />
                        <div className="p-6 space-y-3">
                            <div className="h-6 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="flex justify-between pt-4 border-t border-gray-100">
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                                <div className="h-4 bg-gray-200 rounded w-1/4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}
