import { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import Job from '../components/Job.jsx'

function App(){
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch jobs when component mounts
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            
            // Get the JWT token from localStorage (or wherever you store it)
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }

            const response = await fetch('http://localhost:5001/api/getJobs', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setJobs(data.jobs || []);
            setError(null);
        } catch (err) {
            console.error('Error fetching jobs:', err);
            setError('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-64">
                    <div className="text-xl">Loading jobs...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header />
                <div className="flex justify-center items-center min-h-64">
                    <div className="text-xl text-red-500">Error: {error}</div>
                </div>
            </>
        );
    }

    return(
        <>
        <Header />
        <div className='flex justify-end p-4'>
            <button className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={() => window.location.href = '/add'}>
                ADD JOB
            </button>
        </div>
        <div className="p-4">
            {jobs.length === 0 ? (
                <div className="text-center text-gray-500 text-xl">
                    No jobs found. Click "ADD JOB" to get started!
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Job key={job.id} job={job} />
                    ))}
                </div>
            )}
        </div>
    </>
    )
}

export default App