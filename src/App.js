import React, { useState, useEffect } from "react";
import logo from './logo.svg';
import './App.css';

const apiCall = {
  "type": "subscribe",
    "payload": {
        "channels": [{
                "name": "v2/ticker",
                "symbols": [
                    "USDT",
                    "BTCUSD",
                    "BTCUSDT",
                    "BNB",
                    "ADABTC"
            ]},
        ]
    }
};

function App() {

    const [markOne, setMarkOne ] = useState([]);
    const [tableData, setTableData ] = useState([]);
    const [loader, setLoader ] = useState(true);
    
    const fetchData = async () => {
        const response = await fetch("https://api.delta.exchange/v2/products");
        const data = await response.json();
        setTableData(data.result);
        setLoader(false);
    }

    useEffect(() => {
        fetchData();

        const ws = new WebSocket('wss://socket.delta.exchange');
        
        ws.onopen = (event) => {
            ws.send(JSON.stringify(apiCall));
        };
        ws.onmessage = function (event) {
            const json = JSON.parse(event.data);

            try {
                if ((json.type === 'subscriptions')) {
                    console.log("Loading")
                }

                else {
                    const price = json.mark_price;
                    setMarkOne(markOne => [...markOne.slice(0,2), price]);
     
                }

            } catch (err) {
                console.log(err);
            }
        };
        //clean up function
        return () => ws.close();
    }, []);

    const markPrice = (i) => {
        
        if (i.symbol === 'C-MATIC-3.1-281221') {
            return markOne[0]
        }
        return markOne[2];
    }
    
    const tableDataC = tableData.map((item, index) => (
         
        <div className="table" key={index}>
            <p> {item.symbol}</p>
            <p> {item.description}</p>
            <p>{item.underlying_asset.name}</p>   
            <p>{markPrice(item)}</p>
        </div>
    ));

    return (
        
        <div className="page">
            <header><img src={logo} alt="Delta Exchange"/></header>
            <div className="container">
                <div className="table-header table">
                    <div><h3>Symbol</h3></div>
                    <div><h3>Description</h3></div>
                    <div><h3>Underlying Asset</h3></div>
                    <div><h3>Mark Price</h3></div>
                </div>
                {loader? <p className="loading">Loading</p>: <div>{tableDataC}</div>}
                
            </div>
        </div>
    );
}

export default App;
