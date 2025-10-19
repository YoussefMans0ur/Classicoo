import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClassicoCalculator() {
  const [consoleType, setConsoleType] = useState("PS4");
  const [mode, setMode] = useState("Single");
  const [roomType, setRoomType] = useState("Partition");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(null);

  const calculatePrice = () => {
    if (!startTime || !endTime) return;

    const start = new Date(`2024-01-01T${startTime}`);
    const end = new Date(`2024-01-01T${endTime}`);
    let diffMins = (end - start) / 60000;
    if (diffMins <= 0) diffMins += 24 * 60; // handle overnight

    // Round logic
    const fullQuarters = Math.floor(diffMins / 15);
    const remainder = diffMins % 15;
    const totalQuarters = remainder >= 10 ? fullQuarters + 1 : fullQuarters;

    // Get base prices
    let prices = {};
    if (consoleType === "PS4") {
      if (mode === "Single") prices = { q: 10, h: 25, hr: 45 };
      else prices = { q: 15, h: 25, hr: 55 };
    } else {
      if (roomType === "Partition") {
        if (mode === "Single") prices = { q: 15, h: 30, hr: 60 };
        else prices = { q: 20, h: 35, hr: 70 };
      } else {
        if (mode === "Single") prices = { q: 20, h: 35, hr: 70 };
        else prices = { q: 20, h: 40, hr: 80 };
      }
    }

    // Convert quarters to total hours
    const totalHours = totalQuarters / 4;
    let totalPrice = 0;

    if (totalHours % 1 === 0) totalPrice = totalHours * prices.hr;
    else if (totalHours % 1 === 0.5) totalPrice = Math.floor(totalHours) * prices.hr + prices.h;
    else {
      const fullHours = Math.floor(totalHours);
      const remainderQuarters = totalQuarters - fullHours * 4;
      totalPrice = fullHours * prices.hr;
      if (remainderQuarters === 1) totalPrice += prices.q;
      else if (remainderQuarters === 2) totalPrice += prices.h;
      else if (remainderQuarters === 3) totalPrice += prices.h + prices.q;
    }

    setPrice(totalPrice);
  };

  return (
    <div className="container pt-5">
      <div className="card shadow-lg p-4 bg-dark text-light">
        <h2 className="text-center mb-4">🎮 Classico PlayStation Calculator</h2>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Console Type</label>
            <select
              className="form-select"
              value={consoleType}
              onChange={(e) => setConsoleType(e.target.value)}
            >
              <option>PS4</option>
              <option>PS5</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Mode</label>
            <select
              className="form-select"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option>Single</option>
              <option>Multi</option>
            </select>
          </div>

          {consoleType === "PS5" && (
            <div className="col-md-6">
              <label className="form-label">Room Type</label>
              <select
                className="form-select"
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
              >
                <option>Partition</option>
                <option>Room</option>
              </select>
            </div>
          )}

          <div className="col-md-6">
            <label className="form-label">Start Time</label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">End Time</label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button
              onClick={calculatePrice}
              className="btn btn-primary w-100 mt-3"
            >
              Calculate Price
            </button>
          </div>

          {price !== null && (
            <div className="col-12 text-center mt-4">
              <div className="alert alert-success fs-5 fw-semibold">
                💰 Total Price: {price} EGP
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
