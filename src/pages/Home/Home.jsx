import { useContext, useState } from "react";
import styles from "./Home.module.css";
import { CryptoContext } from "../../context/CryptoContext";
import { Link } from "react-router-dom";

const currencySymbols = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

const Home = () => {
  const { coins, loading, currency } = useContext(CryptoContext);
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(10);

  const filteredCoins = coins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase()) ||
      coin.market_cap_rank.toString().includes(search)
  );

  const piCoin = coins.find(
    (coin) =>
      coin.name.toLowerCase() === "pi network" ||
      coin.symbol.toLowerCase() === "pi"
  );
  const piRank = piCoin ? piCoin.market_cap_rank : "??";

  return (
    <div className="container py-5 text-white">
      <h1 className="fw-semibold mb-3 text-center">Welcome to Trackrypto</h1>
      <p className="fw-medium lead text-center mb-2">
        Track real-time prices, trends, and stats for your favorite
        cryptocurrencies.
      </p>
      <p className="fw-light fs-6 fst-italic text-warning lead text-center mb-3">
        Enter name (e.g, pi network), symbol (e.g, pi) or rank (e.g, {piRank})
        of the cryptocurrency 👇
      </p>
      <div className="row justify-content-center mb-5">
        <div className="col-10 col-sm-8 col-md-5 col-lg-4">
          <div className={styles.searchInput}>
            <input
              type="text"
              className="form-control"
              placeholder="Search for a cryptocurrency..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className={styles.cryptoTableWrapper}>
        <table className={`table text-white ${styles.cryptoTable}`}>
          <thead>
            <tr>
              <th>#</th>
              <th>Coin</th>
              <th>Price</th>
              <th>24h Change</th>
              <th>Market Cap</th>
              <th>Volume (24h)</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              filteredCoins.slice(0, visible).map((coin) => (
                <tr key={coin.id}>
                  <td>{coin.market_cap_rank}</td>
                  <td>
                    <Link to={`/coin/${coin.id}`}>
                      <img
                        src={coin.image}
                        alt={coin.name}
                        width={24}
                        style={{ marginRight: 8, verticalAlign: "middle" }}
                      />
                    </Link>
                    <Link
                      to={`/coin/${coin.id}`}
                      className="text-white fw-bold"
                      style={{ textDecoration: "none" }}
                    >
                      {coin.name}
                    </Link>{" "}
                    <Link
                      to={`/coin/${coin.id}`}
                      className={`${styles.coinSymbol} text-uppercase`}
                      style={{ marginLeft: 4, textDecoration: "none" }}
                    >
                      ({coin.symbol})
                    </Link>
                  </td>
                  <td>
                    {currencySymbols[currency]}{" "}
                    {coin.current_price.toLocaleString()}
                  </td>
                  <td
                    className={`${styles.priceChange} ${
                      coin.price_change_percentage_24h >= 0
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td>
                    {currencySymbols[currency]}{" "}
                    {coin.market_cap.toLocaleString()}
                  </td>
                  <td>
                    {currencySymbols[currency]}{" "}
                    {coin.total_volume.toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && (
          <div className="text-center mt-3">
            {visible < filteredCoins.length && (
              <button
                className="btn btn-warning mx-3"
                onClick={() => setVisible(visible + 10)}
              >
                Load More
              </button>
            )}
            {visible > 10 && (
              <button
                className="btn btn-danger"
                onClick={() => setVisible(Math.max(10, visible - 10))}
              >
                Show Less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
