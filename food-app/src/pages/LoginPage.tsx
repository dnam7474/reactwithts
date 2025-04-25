import React, { useState } from 'react';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        console.log('Login attempt:', { username, password });
        setMessage('Login functionality not fully implemented yet.');
    };

    return (
        <div className={styles.loginContainer}>
        <form onSubmit={handleLogin} className={styles.loginForm}>
            <h2>Login</h2>
            {message && <p className={styles.message}>{message}</p>}
            <div className={styles.inputGroup}>
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            </div>
            <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>
            <button type="submit" className={styles.loginButton}>Log In</button>
        </form>
        </div>
    );
};

export default LoginPage;
