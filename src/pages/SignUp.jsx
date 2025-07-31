import axios from 'axios';
import React from 'react';

function SignUp(){
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleSignup = async () => {
        try {
            await axios.post('http://localhost:5001/api/signUp', {
            email,
            password
            });
            alert('Account created!');
        } catch (err) {
            alert(err.response.data.msg);
        }
    };


    return(
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <button className="absolute top-4 right-8 bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600" onClick={()=>window.location.href='/'}>Sign In</button>
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSignup(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e)=>setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e)=>setPassword(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Confirm Password</label>
                            <input type="password" id="confirm-password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" onChange={(e)=>setConfirmPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">Sign Up</button>
                    </form>
                </div>
            </div>
    </>
    )
    
}

export default SignUp