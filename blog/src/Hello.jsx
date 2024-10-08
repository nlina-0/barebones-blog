import React, { useEffect, useState } from 'react'

function Hello() {
    const [price, setPrice] = useState(0)

    // Automatically runs async
    // When there is an empty dependancy array, the fetch will only be fetched once on mount
    useEffect(() => {
        console.log("Fetching...")
        fetch('https://api.coindesk.com/v1/bpi/currentprice/AUD.json')
            .then(res => res.json())
            .then(data => setPrice(data.bpi.AUD.rate))
    }, [])
    
    return (
        <>
            <h2>Current Price (AUD): {price}</h2>
        </>
    )
}

export default Hello