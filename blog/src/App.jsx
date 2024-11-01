import { useEffect, useState } from 'react'
import { Routes, Route, useParams } from "react-router-dom"
import './App.css'
import NavBar from './NavBar'
import Home from './Home'
import CategorySelection from './CategorySelection'
import NewEntry from './NewEntry'
import ShowEntry from './ShowEntry'

let newEntryId = 4

function App() {
  const [entries, setEntries] = useState([
    {id:1, category: 1, content: "Food is yummmy!"},
    {id:2, category: 2, content: "War never ends."},
    {id:3, category: 3, content: "Coding is fun!"},
  ])

  const [categories, setCategories] = useState([
    {id:1, name: "Food"},
    {id:2, name: "Gaming"},
    {id:3, name: "Coding"},
    {id:4, name: "Other"}
  ])

  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])

  // Fetching Posts from API onMount
  useEffect(() => {
    // Fetch Posts
    fetch("http://localhost:3000/posts/")
      .then(res => res.json())
      .then(data => setPosts(data))

    // Add User fetch
    fetch("http://localhost:3000/users/")
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  const addEntry = (cat_id, content) => {
    // console.log(cat_id, content)
    const newEntry = { id: newEntryId++, category: cat_id, content: content }
    setEntries([...entries, newEntry])
    //console.log(entries)
    return newEntryId-1
  }

  // Higher-order component (HOC)
  const ShowEntryWrapper = () => {
    const { id } = useParams()
    const entry = entries.find(e => e.id == id)
    return entry ? <ShowEntry entry={entry}/> : <h3>Entry not foound!</h3>
  }

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home entries={entries} posts={posts}/>} />
        <Route path="/category" element={<CategorySelection categories={categories}/>}/>
        <Route path="/entry" >
          <Route path=":id" element={<ShowEntryWrapper />}/>
          <Route path="new/:cat_id" element={<NewEntry categories={categories} addEntry={addEntry}/>}/>
        </Route>
        <Route path="*"/>
      </Routes>
    </>
  )
}

export default App
