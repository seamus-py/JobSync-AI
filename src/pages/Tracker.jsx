import { useState } from 'react'
import Header from '../components/Header.jsx'
import Job from '../components/Job.jsx'

function App(){
    return(
        <>
        <Header />
        <div className='flex justify-end p-4'>
            <button className="bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600"
            onClick={() => window.location.href = '/add'}>
                ADD JOB
            </button>
        </div>
        <div>
            <Job/>
        </div>
    </>
    )
    
}

export default App