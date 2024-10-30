import React, { useState } from 'react'
import { Link } from 'react-router-dom'

function CategorySelection({ categories }) {
    
    return (
        <>
            <div className="m-4">
                <h3>Please select a category:</h3>
                <ul>
                    {
                        categories.map(cat => (
                            <li key={cat.id}>
                                <Link to={`/entry/new/${cat.id}`}>{cat.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default CategorySelection