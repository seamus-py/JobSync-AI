
export default function Job({ job }) {
    return (
        <div className="flex items-center justify-between p-3 mb-2 bg-white shadow-md rounded-xl hover:shadow-lg transition-shadow duration-200">
            {/* Left section: Job info */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 flex-1">
                <div className="flex flex-col">
                    <span className="font-semibold text-lg text-gray-800">{job.company}</span>
                    <span className="text-gray-500 text-sm">{job.title}</span>
                </div>
                <div className="mt-1 md:mt-0">
                    <span className="text-gray-600 text-sm">Status: </span>
                    <span className={`font-medium ${job.status === 'In Process' ? 'text-yellow-500' : 'text-green-500'}`}>
                        {job.status}
                    </span>
                </div>
            </div>

            {/* Right section: Edit button (layout only) */}
            <button className="bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors">
                Edit
            </button>
        </div>
    );
}
