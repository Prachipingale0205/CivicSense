const STATUS_ORDER = ['Submitted', 'Under Review', 'In Progress', 'Resolved', 'Rejected'];

export default function StatusTimeline({ statusHistory = [] }) {
    if (!statusHistory.length) return null;

    const currentIndex = statusHistory.length - 1;

    return (
        <div className="space-y-0">
            {statusHistory.map((entry, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;
                const isLast = index === statusHistory.length - 1;

                return (
                    <div key={index} className="flex gap-3">
                        {/* Dot and line */}
                        <div className="flex flex-col items-center">
                            {isCompleted && (
                                <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1" />
                            )}
                            {isCurrent && (
                                <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 mt-1 animate-pulse" />
                            )}
                            {!isCompleted && !isCurrent && (
                                <div className="w-3 h-3 border-2 border-gray-300 rounded-full flex-shrink-0 mt-1" />
                            )}
                            {!isLast && <div className="w-px bg-gray-200 h-8 ml-0" />}
                        </div>

                        {/* Content */}
                        <div className="pb-4">
                            <p className="font-medium text-sm text-gray-900">{entry.status}</p>
                            <p className="text-xs text-gray-400">
                                {new Date(entry.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            {entry.note && (
                                <p className="text-xs text-gray-500 italic mt-0.5">{entry.note}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
