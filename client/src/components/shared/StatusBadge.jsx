export default function StatusBadge({ status }) {
    const config = {
        Submitted: 'bg-[#eff6ff] text-[#2563eb]',
        'Under Review': 'bg-[#fffbeb] text-[#d97706]',
        'In Progress': 'bg-[#eff6ff] text-[#1d4ed8]',
        Resolved: 'bg-[#f0fdf4] text-[#16a34a]',
        Rejected: 'bg-[#fef2f2] text-[#dc2626]',
    };

    const classes = config[status] || 'bg-gray-100 text-gray-600';

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${classes}`}>
            {status}
        </span>
    );
}
