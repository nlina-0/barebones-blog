import React, { useEffect, useState } from 'react'

function CoinBase({ currency }) {
    const [price, setPrice] = useState(0)

    // This useState is now being recieved as a prop, makes the component more resuable, display this component in other situations
    // const [currency, setCurrency] = useState("AUD") 

    // Automatically runs async
    // When there is an empty dependancy array, the fetch will only be fetched once on mount
    // When there is a value in the dependency array and it changes, the arrow func will be fired everytime it updates
    useEffect(() => {
        console.log("Fetching...")
        fetch(`https://api.coindesk.com/v1/bpi/currentprice/${currency}.json`)
            .then(res => res.json())
            .then(data => setPrice(data.bpi[currency].rate))
    }, [currency])
    
    return (
        <>  
            {/* What if i wanted to put a dollar sign there */}
            <h2>Current Price ({currency}): {price}</h2>
        </>
    )
}

export default CoinBase