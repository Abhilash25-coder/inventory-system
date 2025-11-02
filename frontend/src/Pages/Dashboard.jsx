import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Dashboard.css";


export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [ledger, setLedger] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    const [p, l] = await Promise.all([api.getProducts(), api.getLedger()]);
    setProducts(p.data);
    setLedger(l.data);
  };

  const simulate = async () => {
    await api.simulate();
    alert("Dummy events pushed!");
    loadData();
  };

  const handleLogout = () => {
    api.stopProducer();
    localStorage.removeItem("auth");
    navigate("/");
  };

  useEffect(() => {
    api.startProducer();  
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => {
      api.stopProducer();
      clearInterval(interval);
    }
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Inventory Dashboard</h1>
        <div className="button-group">
          <button onClick={simulate} className="simulate-button">
            Simulate Transactions
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <h2 className="section-title">Product Stock Overview</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th className="table-header">Product ID</th>
            <th className="table-header">Quantity</th>
            <th className="table-header">Total Cost</th>
            <th className="table-header">Average Cost</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, i) => (
            <tr key={i} className="table-row">
              <td className="table-cell">{p.product_id}</td>
              <td className="table-cell">{p.total_qty}</td>
              <td className="table-cell">{p.total_cost}</td>
              <td className="table-cell">{p.avg_cost}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="section-title">Transaction Ledger</h2>
      <table className="table-container">
        <thead>
          <tr>
            <th className="table-header">Product</th>
            <th className="table-header">Quantity</th>
            <th className="table-header">Total Cost</th>
            <th className="table-header">Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {ledger.map((t, i) => (
            <tr key={i} className="table-row">
              <td className="table-cell">{t.product_id}</td>
              <td className="table-cell">{t.quantity}</td>
              <td className="table-cell">{t.total_cost}</td>
              <td className="table-cell">{new Date(t.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
