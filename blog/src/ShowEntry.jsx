import React from 'react'

function ShowEntry({ entry }) {
    return (
        <>
            <p>ShowEntry: Posted in Category</p>
            <p>{entry.content}</p>
        </>
    )
}

export default ShowEntry