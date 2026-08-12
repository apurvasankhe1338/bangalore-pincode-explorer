import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function App() {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchPincode(event) {
    event.preventDefault();
    setError("");
    setResult(null);

    if (!/^\d{6}$/.test(pincode)) {
      setError("Enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/pincode/${pincode}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Pincode not found.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function clearSearch() {
    setPincode("");
    setResult(null);
    setError("");
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">Bengaluru • Karnataka</div>
        <h1>Bangalore Pincode Explorer</h1>
        <p>Enter a Bangalore pincode to discover its postal areas and post offices.</p>

        <form className="search" onSubmit={searchPincode}>
          <input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter 6-digit pincode"
            inputMode="numeric"
            maxLength={6}
            aria-label="Bangalore pincode"
          />
          <button disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <div className="examples">
          Try a pincode such as <button type="button" onClick={() => setPincode("560001")}>560001</button>
          <button type="button" onClick={() => setPincode("560034")}>560034</button>
          <button type="button" onClick={() => setPincode("560100")}>560100</button>
        </div>
      </section>

      <section className="content" aria-live="polite">
        {error && (
          <div className="error">
            <strong>Couldn’t find it</strong>
            <span>{error}</span>
          </div>
        )}

        {result && (
          <div className="result-card">
            <div className="result-header">
              <div>
                <span className="label">PINCODE</span>
                <h2>{result.pincode}</h2>
              </div>
              <button className="secondary" onClick={clearSearch}>Clear</button>
            </div>

            <div className="summary">
              <div>
                <span>City</span>
                <strong>{result.city}</strong>
              </div>
              <div>
                <span>State</span>
                <strong>{result.state}</strong>
              </div>
              <div>
                <span>Areas found</span>
                <strong>{result.areas.length}</strong>
              </div>
            </div>

            <h3>Area names</h3>
            <div className="areas">
              {result.areas.map((area) => (
                <div className="area" key={area}>{area}</div>
              ))}
            </div>

            <h3>Post offices</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Delivery</th>
                    <th>District</th>
                  </tr>
                </thead>
                <tbody>
                  {result.postOffices.map((office) => (
                    <tr key={`${office.name}-${office.branchType}`}>
                      <td>{office.name}</td>
                      <td>{office.branchType}</td>
                      <td>{office.deliveryStatus}</td>
                      <td>{office.district}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!result && !error && !loading && (
          <div className="empty">
            <div className="empty-icon">⌖</div>
            <h2>Find a Bangalore area</h2>
            <p>Search by pincode to see matching area names and postal details.</p>
          </div>
        )}
      </section>

      <footer>
        Data is retrieved through the India Post Pincode API via the backend.
      </footer>
    </main>
  );
}