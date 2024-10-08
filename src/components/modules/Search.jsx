import { useEffect, useState } from "react"
import { RotatingLines } from "react-loader-spinner";
import { searchCoin } from "../../services/cryptoApi";


function Search({ currency, setCurrency }) {

    const [text, setText] = useState("");
    const [coins, setCoins] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
 
        setCoins([]);

        const controller = new AbortController();

        if (!text) return;

        const search = async () => {

            try {
                const res = await fetch(searchCoin(text), { signal: controller.signal });
                const json = await res.json();
                console.log(json)
                if (json.coins) {
                    setCoins(json.coins)
                    setIsLoading(false);
                } else {
                    alert(json.status.error_message)
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    alert(error.message)
                }
            }

        }

        setIsLoading(true);
        search();

        return () => controller.abort();

    }, [text])

  return (
    <div>
        <input type="text" placeholder="Search here" value={text} onChange={(e) => setText(e.target.value)} />
        <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option value="usd">USD</option>
            <option value="eur">EUR</option>
            <option value="jpy">JPY</option>
        </select>
        <div>
            {!isLoading && <RotatingLines width="50px" height="50px" strokeWidth="2" strokeColor="#3874ff" />}
            <ul>
                {coins.map(coin => <li key={coin.id}>
                    <img src={coin.thumb} alt={coin.name} />
                    <p>{coin.name}</p>
                </li>)}
            </ul>
        </div>
    </div>
  )
}

export default Search