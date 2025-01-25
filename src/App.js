import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Create this file for custom styles

function App() {
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePincodeChange = (e) => {
    setPincode(e.target.value);
  };

  const handleLookup = async () => {
    if (pincode.length !== 6 || isNaN(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      if (response.data[0].Status === "Error") {
        setError(response.data[0].Message);
        setData([]);
        setFilteredData([]);
      } else {
        setData(response.data[0].PostOffice);
        setFilteredData(response.data[0].PostOffice);
      }
    } catch (err) {
      setError("An error occurred while fetching data.");
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = data.filter(
      (item) => item.Name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="App">
      <h1>Pincode Lookup</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={handlePincodeChange}
          maxLength={6}
        />
        <button onClick={handleLookup} disabled={loading}>
          {loading ? "Fetching..." : "Lookup"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <div className="loader"></div>}

      {!loading && filteredData.length > 0 && (
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filter by Post Office Name"
            onChange={handleFilterChange}
          />
        </div>
      )}

      {!loading && filteredData.length > 0 && (
        <div className="results">
          {filteredData.map((item, index) => (
            <div key={index} className="result-item">
              <p>
                <strong>Post Office Name:</strong> {item.Name}
              </p>
              <p>
                <strong>Pincode:</strong> {item.Pincode}
              </p>
              <p>
                <strong>District:</strong> {item.District}
              </p>
              <p>
                <strong>State:</strong> {item.State}
              </p>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredData.length === 0 && data.length === 0 && (
        <p>No data found for the entered pincode.</p>
      )}

      {!loading && filteredData.length === 0 && data.length > 0 && (
        <p>Couldn’t find the postal data you’re looking for…</p>
      )}
    </div>
  );
}

export default App;