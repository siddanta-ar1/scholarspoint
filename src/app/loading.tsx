import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
            <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
    );
}
