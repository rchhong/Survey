import React from 'react';

export default function Error(props) {
    return (
        <div>
            <h1>Error {props.status}</h1>
            <div>{props.message}</div>
        </div>
    );
}