
export default function Job({ job }){
    // If no job prop is passed, return empty div (for backward compatibility)
    if (!job) {
        return <div className="bg-blue-300 text-white p-5 rounded-lg shadow-md"></div>;
    }

    return(
        <div className="bg-blue-300 text-white p-5 rounded-lg shadow-md mb-4">
            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
            <p className="text-lg mb-1">Company: {job.company}</p>
            <p className="text-sm">Status: {job.status}</p>
        </div>
    );
}