import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import styles from "./Coin.module.css";
import { CryptoContext } from "../../context/CryptoContext";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const Coin = () => {
  const { id } = useParams();
  const { currency } = useContext(CryptoContext);
  const [coin, setCoin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().slice(0, 10);
  });
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));

  const debounceRef = useRef();

  useEffect(() => {
    if (new Date(from) > new Date(to)) return; // Prevent invalid range
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const fetchChart = async () => {
        try {
          let url;
          if (
            from !==
              new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .slice(0, 10) ||
            to !== new Date().toISOString().slice(0, 10)
          ) {
            const fromTimestamp = Math.floor(new Date(from).getTime() / 1000);
            const toTimestamp = Math.floor(new Date(to).getTime() / 1000);
            url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart/range?vs_currency=${currency}&from=${fromTimestamp}&to=${toTimestamp}`;
          } else {
            // Default: last 7 days
            url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=7`;
          }
          const res = await fetch(url);
          const data = await res.json();
          setChartData(data.prices);
        } catch (error) {
          setChartData(null);
        }
      };
      fetchChart();
    }, 400); // 400ms debounce
    return () => clearTimeout(debounceRef.current);
  }, [id, currency, from, to]);

  useEffect(() => {
    const fetchCoin = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
        );
        if (!res.ok) {
          // If rate limited or error, showing a friendly message
          setCoin({
            error: true,
            message: `API error: ${res.status} ${res.statusText}`,
          });
        } else {
          const data = await res.json();
          // If API returns error in JSON (e.g. rate limit), handling it
          if (data.error) {
            setCoin({ error: true, message: data.error });
          } else {
            setCoin(data);
          }
        }
      } catch (error) {
        setCoin({
          error: true,
          message: "Network error. Please try again later.",
        });
      }
      setLoading(false);
    };
    fetchCoin();
  }, [id, currency]);

  if (loading) {
    return <div className="text-center text-white my-5">Loading...</div>;
  }

  if (!coin || coin.error) {
    return (
      <div className="text-center text-danger my-5">
        {coin && coin.message ? coin.message : "Coin not found."}
      </div>
    );
  }

  const currencySymbols = {
    usd: "$",
    eur: "€",
    inr: "₹",
  };

  return (
    <div>
      <h2 className="fw-semibold my-2 text-center text-white text-decoration-underline">
        {coin.name}
      </h2>
      <div className="text-center">
        <img src={coin.image.large} alt={coin.name} width={64} />
        <div className="my-3">
          <label className="text-white mx-2">From:</label>
          <input
            type="date"
            value={from}
            max={to}
            onChange={(e) => setFrom(e.target.value)}
          />
          <label className="text-white mx-2">To:</label>
          <input
            type="date"
            value={to}
            min={from}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        {chartData && chartData.length > 0 ? (
          <div className="my-4">
            <Line
              data={{
                labels: chartData.map((item) =>
                  new Date(item[0]).toLocaleDateString()
                ),
                datasets: [
                  {
                    label: "Price (last 7 days)",
                    data: chartData.map((item) => item[1]),
                    borderColor: "#fbc531",
                    backgroundColor: "rgba(251,197,49,0.2)",
                    fill: true,
                    tension: 0.3,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    display: true,
                    title: { display: true, text: "Date", color: "#fbc531" },
                    ticks: { color: "#fbc531" },
                  },
                  y: {
                    display: true,
                    title: {
                      display: true,
                      text: `Price (${currency.toUpperCase()})`,
                      color: "#fbc531",
                    },
                    ticks: { color: "#fbc531" },
                  },
                },
              }}
            />
          </div>
        ) : (
          <div className="text-warning">
            No chart data available for this range.
          </div>
        )}
        <div className={styles.coinCard}>
          <p className="text-white mt-3">
            <strong>Symbol:</strong> {coin.symbol.toUpperCase()}
            <br />
            <strong>Rank:</strong> {coin.market_cap_rank}
            <br />
            <strong>Current Price:</strong> {currencySymbols[currency]}
            {coin.market_data.current_price[currency]?.toLocaleString()}
            <br />
            <strong>Market Cap:</strong> {currencySymbols[currency]}
            {coin.market_data.market_cap[currency]?.toLocaleString()}
            <br />
            <strong>24h Change:</strong>{" "}
            {coin.market_data.price_change_percentage_24h?.toFixed(2)}%
          </p>
          <div
            className="text-white text-start mx-auto"
            style={{ maxWidth: 600 }}
          >
            <strong>Description:</strong>
            <div
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split(". ")[0] + ".",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coin;
