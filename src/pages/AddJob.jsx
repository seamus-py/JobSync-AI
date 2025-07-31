import { useState } from 'react'
import axios from 'axios';

function AddJob(){
    const [company, setCompany] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [resume, setResume] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [score, setScore] = useState(null);
    const [keywords, setKeywords] = useState('');


    async function handleScore() {
        try{
            console.log("Fetching score for resume:", resume, "and job description:", jobDescription);
            const res = await axios.post("http://localhost:5001/api/getScore", {
                resume,
                jobDescription,
            });
            setScore(res.data.score);
            setKeywords(res.data.missing_keywords);
        }
        catch (error) {
            if (error.response) {
                // Server responded with a status code outside 2xx
                console.error("Backend error:", error.response.data);
                console.error("Status:", error.response.status);
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                // Request was made but no response
                console.error("No response received:", error.request);
            } else {
                // Something else triggered the error
                console.error("Axios error:", error.message);
            }
            }
    }

    return(
        <>
            <div className='flex flex-row p-4 space-x-4'>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Company</h1>
                    <input
                        type="text"
                        className="ml-4 p-2 border rounded-lg"
                        placeholder="Enter text..."
                    />
                </div>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Job Title</h1>
                    <input
                        type="text"
                        className="ml-4 p-2 border rounded-lg"
                        placeholder="Enter text..."
                    />
                </div>
            </div>
            <div className='flex flex-row p-4 space-x-4'>
                <div className='flex flex-col p-4 bg-blue-300 rounded-lg shadow-md w-1/2'>
                    <h1 className="text-2xl font-bold p-4">Resume</h1>
                    <textarea
                    className="p-4 text-lg border rounded-lg"
                    rows={15}
                    placeholder="Enter multiple lines of text..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                    ></textarea>
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
                onClick = {handleScore}
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
            
        </>
    )
    
}

export default AddJob