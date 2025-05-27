import React, { useState, useEffect, useRef } from 'react';
import './Login.css';
const Login = ({ setIsAuthenticated }) => {
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const inputRef = useRef();
    // const navigate = useNavigate();

    useEffect(() => {
        const handleEnterKey = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        };

        const input = inputRef.current;
        input.addEventListener('keypress', handleEnterKey);
        return () => input.removeEventListener('keypress', handleEnterKey);
    }, []);

    const handleLogin = () => {
        if (!password) {
            setErrorMessage('Please enter a password');
            return;
        }

        fetch('api/login', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setIsAuthenticated(true);
                    // navigate("")
                    
                } else {
                    setIsAuthenticated(false);
                    setErrorMessage('Invalid password. Please try again.');
                   
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                setErrorMessage('An error occurred. Please try again.');
            });
    };

    return (
        <div className='login-body'>
            <div className="login-container">
                <h1 className="login-title">Phoenixd Wallet</h1>
                <p className="welcome-text">Welcome back</p>
                {errorMessage && (
                    <div
                        id="login-error-message"
                        style={{ color: 'red', marginBottom: '10px' }}
                    >
                        {JSON.stringify(errorMessage)}
                    </div>
                )}
                <input
                    id="password"
                    type="password"
                    className="input-box"
                    placeholder="Password"
                    ref={inputRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    id="login-button"
                    className="login-button"
                    onClick={handleLogin}
                >
                    Login <i className="bi bi-box-arrow-in-right"></i>
                </button>
            </div>
        </div>

    );
};

export default Login;
