import React from 'react';

export default function Header(){
    return(
        <header className="bg-blue-300 text-white p-5 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold">JobSync AI</h1>
            <nav className="mt-2">
                <ul className="flex space-x-4">
                    <li><a href="/" className="hover:underline">Home</a></li>
                    <li><a href="/tracker" className="hover:underline">Tracker</a></li>
                    <li><a href="/resume-match" className="hover:underline">Resume Match</a></li>
                </ul>
            </nav>
        </header>
    )
}