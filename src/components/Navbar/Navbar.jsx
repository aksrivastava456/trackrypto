import { useContext } from "react";
import styles from "./Navbar.module.css";
import { CryptoContext } from "../../context/CryptoContext";

const Navbar = () => {
  const { currency, setCurrency } = useContext(CryptoContext);
  return (
    <nav className={`navbar navbar-expand-lg navbar-light ${styles.myNavbar}`}>
      <div className={`container-fluid ${styles.brandContainer}`}>
        <a className={`navbar-brand ${styles.brandLogo}`} href="#">
          📈{" "}
          <span className="fs-3 fw-bold text-danger">
            Track<span className="text-warning">rypto</span>
          </span>
        </a>
        <select
          className={`form-select w-auto me-2 d-lg-none ${styles.currencySelect}`}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="usd">$ USD</option>
          <option value="eur">€ EUR</option>
          <option value="inr">₹ INR</option>
        </select>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul
            className={`fw-semibold navbar-nav mb-2 mb-lg-0 ${styles.listItems}`}
          >
            <li className="nav-item mx-2">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link" href="#">
                Features
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link" href="#">
                About Us
              </a>
            </li>
            <li className="nav-item mx-2">
              <a className="nav-link" href="#">
                Help
              </a>
            </li>
          </ul>
          <select
            className={`form-select w-auto me-2 d-none d-lg-block ${styles.currencySelect}`}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="usd">$ USD</option>
            <option value="eur">€ EUR</option>
            <option value="inr">₹ INR</option>
          </select>
          <button className={`btn btn-success ${styles.signUpButton}`}>
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
