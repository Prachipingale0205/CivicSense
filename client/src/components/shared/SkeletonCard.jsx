export default function SkeletonCard({ compact = false, lines = 3 }) {
    const widths = ['w-1/2', 'w-full', 'w-3/4', 'w-2/3', 'w-5/6'];

    return (
        <div className={`bg-white rounded-xl border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
            <div className="space-y-3">
                {Array.from({ length: lines }).map((_, i) => (
                    <div
                        key={i}
                        className={`bg-gray-200 animate-pulse rounded h-4 ${widths[i % widths.length]}`}
                    />
                ))}
            </div>
        </div>
    );
}
