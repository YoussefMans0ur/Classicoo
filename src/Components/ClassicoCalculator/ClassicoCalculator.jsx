import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ClassicoCalculator() {
  const [consoleType, setConsoleType] = useState("PS5");
  const [roomType, setRoomType] = useState("Partition");
  const [sessions, setSessions] = useState([
    { mode: "Single", startTime: "", endTime: "" },
  ]);
  const [results, setResults] = useState([]);

  const getPrices = (mode) => {
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
    return prices;
  };

  const calculateSessionPrice = (startTime, endTime, mode) => {
    if (!startTime || !endTime) return { price: 0, duration: "0m" };

    const start = new Date(`2025-01-01T${startTime}`);
    const end = new Date(`2025-01-01T${endTime}`);
    let diffMins = (end - start) / 60000;
    if (diffMins <= 0) diffMins += 24 * 60; // handle overnight

    const fullQuarters = Math.floor(diffMins / 15);
    const remainder = diffMins % 15;
    const totalQuarters = remainder >= 10 ? fullQuarters + 1 : fullQuarters;

    const prices = getPrices(mode);
    const totalHours = totalQuarters / 4;
    let totalPrice = 0;

    if (totalHours % 1 === 0) totalPrice = totalHours * prices.hr;
    else if (totalHours % 1 === 0.5)
      totalPrice = Math.floor(totalHours) * prices.hr + prices.h;
    else {
      const fullHours = Math.floor(totalHours);
      const remainderQuarters = totalQuarters - fullHours * 4;
      totalPrice = fullHours * prices.hr;
      if (remainderQuarters === 1) totalPrice += prices.q;
      else if (remainderQuarters === 2) totalPrice += prices.h;
      else if (remainderQuarters === 3) totalPrice += prices.h + prices.q;
    }

    const hours = Math.floor(diffMins / 60);
    const minutes = Math.round(diffMins % 60);
    const duration = `${hours > 0 ? hours + "h " : ""}${minutes}m`;

    return { price: totalPrice, duration };
  };

  const handleAddSession = () => {
    setSessions([...sessions, { mode: "Single", startTime: "", endTime: "" }]);
  };

  const handleRemoveSession = (index) => {
    const updated = sessions.filter((_, i) => i !== index);
    setSessions(updated);
  };

  const handleSessionChange = (index, field, value) => {
    const updated = [...sessions];
    updated[index][field] = value;
    setSessions(updated);
  };

  const calculateTotal = () => {
    let total = 0;
    const resultDetails = sessions.map((s, index) => {
      const { price, duration } = calculateSessionPrice(
        s.startTime,
        s.endTime,
        s.mode
      );
      total += price;
      return {
        session: index + 1,
        mode: s.mode,
        startTime: s.startTime,
        endTime: s.endTime,
        duration,
        price,
      };
    });

    setResults([...resultDetails, { total }]);
  };

  const formatTime12 = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":").map(Number);
    let period = "AM";
    let h = hours;

    if (h === 0) h = 12;
    else if (h === 12) period = "PM";
    else if (h > 12) {
      h -= 12;
      period = "PM";
    }

    return `${h.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")} ${period}`;
  };

  return (
    <div className="container pt-5 pb-5">
      <div className="card shadow-lg p-4 bg-dark text-light mb-5">
        <h2 className="text-center mb-4">🎮 Classico PlayStation Calculator</h2>

        {/* PS Type & Room Type */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label className="form-label">PS Type</label>
            <select
              className="form-select"
              value={consoleType}
              onChange={(e) => setConsoleType(e.target.value)}
            >
              <option>PS4</option>
              <option>PS5</option>
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
        </div>

        {/* Sessions */}
        {sessions.map((session, index) => (
          <div key={index} className="position-relative border rounded p-3 mb-3 bg-secondary">
            {/* ❌ Remove Button (except for first session) */}
            {index > 0 && (
              <button
                type="button"
                className="btn-close position-absolute top-0 end-0 m-2"
                aria-label="Remove"
                onClick={() => handleRemoveSession(index)}
              ></button>
            )}

            <h5 className="text-center text-light">Session {index + 1}</h5>
            <div className="row g-3 align-items-end justify-content-center">
              <div className="col-md-3">
                <label className="form-label">Mode</label>
                <select
                  className="form-select"
                  value={session.mode}
                  onChange={(e) =>
                    handleSessionChange(index, "mode", e.target.value)
                  }
                >
                  <option>Single</option>
                  <option>Multi</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Start Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={session.startTime}
                  onChange={(e) =>
                    handleSessionChange(index, "startTime", e.target.value)
                  }
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">End Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={session.endTime}
                  onChange={(e) =>
                    handleSessionChange(index, "endTime", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-center mb-3">
          <button onClick={handleAddSession} className="btn btn-outline-light">
            ➕ Add Another Time
          </button>
        </div>

        <div className="col-6 offset-3">
          <button
            onClick={calculateTotal}
            className="btn btn-primary w-100 mt-3"
          >
            Calculate Total Price
          </button>
        </div>

        {results.length > 0 && (
          <div className="col-12 text-center mt-4">
            <div className="alert alert-success fs-5 fw-semibold text-start">
              {results.slice(0, -1).map((r) => (
                <div key={r.session}>
                  🕒 <strong>Session {r.session}</strong> ({r.mode}):{" "}
                  {formatTime12(r.startTime)} → {formatTime12(r.endTime)} ={" "}
                  {r.duration} → <strong>{r.price} EGP</strong>
                </div>
              ))}
              <hr />
              <div className="text-center fs-4">
                💰 Total:{" "}
                <strong>{results[results.length - 1].total} EGP</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}