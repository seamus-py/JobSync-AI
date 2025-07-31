import { useState } from 'react'
import axios from 'axios';

function SignIn(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://localhost:5001/api/signIn', {
            email,
            password
            });
            if (response.data.msg == 'Login successful') {
                alert('Sign In Successful!');
                window.location.href = '/tracker';
            }
        } catch (err) {
            alert(err.response.data.msg);
        }
    };


    return(
        <>
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <button className="absolute top-4 right-8 bg-blue-500 text-white p-2 rounded-lg shadow-md hover:bg-blue-600" onClick={()=>window.location.href='/signup'}>Sign Up</button>
                <div className="bg-white p-8 rounded-lg shadow-md w-96">
                    <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSignIn(); }}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">Email</label>
                            <input type="email" id="email" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e)=>setEmail(e.target.value)} required />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">Password</label>
                            <input type="password" id="password" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={password} onChange={(e)=>setPassword(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200">Sign In</button>
                    </form>
                </div>
            </div>
    </>
    )
    
}

export default SignIn