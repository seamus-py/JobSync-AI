import { useState } from 'react'
import axios from 'axios';

function AddJob(){
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [resumeFile, setResumeFile] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [score, setScore] = useState(null);
    const [keywords, setKeywords] = useState('');

    async function handleScore() {
        try {
            const formData = new FormData();
            formData.append("resume", resumeFile);
            formData.append("jobDescription", jobDescription);

            const res = await axios.post("http://localhost:5001/api/getScore", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            setScore(res.data.score);
            setKeywords(res.data.missing_keywords);
        } catch (error) {
            console.error("Error fetching score:", error);
        }
    }

    async function handleAddJob() {
        try {
            const formData = new FormData();
            formData.append("company", company);
            formData.append("jobTitle", jobTitle);
            formData.append("resume", resumeFile); // file
            formData.append("jobDescription", jobDescription); // as text
            formData.append("score", score); // number
            formData.append("missingKeywords", keywords); // string or JSON.stringify if list

            await axios.post(
                'http://localhost:5001/api/saveJob',
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            alert('Job saved!');
        } catch (err) {
            alert(err.response?.data?.msg || err.message);
        }
    }

    return (
        <>
            <div className='flex flex-row p-4 space-x-4'>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Company</h1>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="ml-4 p-2 border rounded-lg"
                        placeholder="Enter text..."
                    />
                </div>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Job Title</h1>
                    <input
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        className="ml-4 p-2 border rounded-lg"
                        placeholder="Enter text..."
                    />
                </div>
            </div>
            <div className='flex flex-row p-4 space-x-4'>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Resume</h1>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setResumeFile(e.target.files[0])}
                        className="ml-4 p-2 border rounded-lg"
                    />
                </div>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Job Description</h1>
                    <textarea
                        className="p-4 text-lg border rounded-lg"
                        rows={15}
                        placeholder="Enter multiple lines of text..."
                        value={jobDescription}
                        onChange={(e)=> setJobDescription(e.target.value) }
                    ></textarea>
                </div>
            </div>
            <button 
                className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 m-4"
                onClick={handleScore}
            >
                Check Match Score
            </button>
            
            <div className='flex flex-row p-4 space-x-4'>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Match Score: {score}</h1>
                </div>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Missing Keywords: {keywords}</h1>
                </div>
            </div>

            <button 
                className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600 m-4"
                onClick={handleAddJob}
            >
                Add Job
            </button>
        </>
    )
}

export default AddJob
