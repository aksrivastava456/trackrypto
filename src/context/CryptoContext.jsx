import { createContext, useEffect, useState } from "react";

export const CryptoContext = createContext();

export const CryptoContextProvider = ({ children }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrencyState] = useState("usd");

  const setCurrency = (cur) => {
    setLoading(true);
    setCurrencyState(cur);
  };

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=CG-RHYhbieuv5dPQaN1zUkNumSK`
        );
        const data = await response.json();
        setCoins(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching crypto data:", error);
        setLoading(false);
      }
    };
    fetchCryptoData();
  }, [currency]);

  const value = {
    coins,
    loading,
    currency,
    setCurrency,
  };

  return (
    <CryptoContext.Provider value={value}>{children}</CryptoContext.Provider>
  );
};
