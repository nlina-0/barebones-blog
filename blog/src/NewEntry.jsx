import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function NewEntry({ categories, addEntry }) {
    const [content, setContent] = useState("")
    
    const nav = useNavigate()
    const { cat_id } = useParams()
    const cat = categories.find(c => c.id == cat_id)

    const submitHandler = e => {
        e.preventDefault()
        const id = addEntry(cat.id, content)
        // Return success message and redirect to the entry
        nav(`/entry/${id}`)
        //console.log(nav)
    }

    return cat ? (
        <>
            <div className="column is-four-fifths">
                <h3 className="m-4">New Entry in {cat.name} </h3>
                <form onSubmit={submitHandler}>
                    <div className="control">
                        <textarea value={content} onChange={e => setContent(e.target.value)} className="textarea m-4" placeholder="e.g. Hello world" ></textarea>
                    </div>
                    <button className="button mx-4">Submit</button>
                </form>
            </div>
        </>
    ) : (
        <h3>Invalid Category ID!</h3>
    )
}

export default NewEntry