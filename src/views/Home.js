import React from 'react';
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/survey">Survey</Link>
            <br></br>
            <Link to="/edit">Edit Survey</Link>
        </div>
    );
}