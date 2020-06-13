import React from 'react';
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <h1>Home</h1>
            <Link to="/survey/visitors">Visitor Log</Link>
            <br></br>
            <Link to="/edit/visitors">Edit Visitor Log</Link>
            <br></br>
            <Link to="/survey/team">Team Member Log</Link>
            <br></br>
            <Link to="/edit/team">Edit Team Member Log</Link>
            <br></br>
            <Link to="/survey/residents">Resident Log</Link>
            <br></br>
            <Link to="/edit/residents">Edit Resident Log</Link>        
            <br></br>
            <Link to="/analytics">Analytics</Link>
        </div>
    );
}
