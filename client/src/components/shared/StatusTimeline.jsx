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
                    <div key={index} className="flex gap-3.5">
                        {/* Dot and line */}
                        <div className="flex flex-col items-center">
                            {isCompleted && (
                                <div className="w-3 h-3 bg-emerald-500 rounded-full flex-shrink-0 mt-1 shadow-sm ring-2 ring-emerald-100" />
                            )}
                            {isCurrent && (
                                <div className="w-3 h-3 bg-primary-600 rounded-full flex-shrink-0 mt-1 animate-pulse shadow-sm ring-2 ring-primary-100" />
                            )}
                            {!isCompleted && !isCurrent && (
                                <div className="w-3 h-3 border-2 border-gray-300 rounded-full flex-shrink-0 mt-1" />
                            )}
                            {!isLast && <div className="w-px bg-gray-200 h-8 ml-0" />}
                        </div>

                        {/* Content */}
                        <div className="pb-4">
                            <p className="font-semibold text-[13px] text-gray-900">{entry.status}</p>
                            <p className="text-[12px] text-gray-400 mt-0.5">
                                {new Date(entry.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                            {entry.note && (
                                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">{entry.note}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
