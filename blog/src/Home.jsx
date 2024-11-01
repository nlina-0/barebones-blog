import React from 'react'
import { Link } from 'react-router-dom'

function Home({ entries, posts }) {
    // Display all blog posts

    return (
        <>
            <div className="column is-four-fifths">
                <h2>Entries</h2>
                <ul>
                    {entries.map(entry => (
                        <li key={entry.id}>
                            <Link to={`/entry/${entry.id}`}>{entry.content}</Link>
                        </li>
                    ))}
                </ul>

                <h2>Posts</h2>
                <ul>
                    {posts.map(post => (
                        <li key={post.id}>
                            <Link to={``}>{post.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Home