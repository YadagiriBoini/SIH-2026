import { useState } from "react";
import { analyzeSpill } from "../services/api";

function InputPanel() {
  const [file, setFile] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [aisWindow, setAisWindow] = useState("24");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a satellite image.");
      return;
    }

    if (!latitude || !longitude) {
      alert("Please enter latitude and longitude.");
      return;
    }

    if (!date || !time) {
      alert("Please select observation date and time.");
      return;
    }

    const formData = new FormData();

    formData.append("satellite_image", file);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("observation_date", date);
    formData.append("observation_time", time);
    formData.append("ais_window", aisWindow);

    try {
      setLoading(true);

      const response = await analyzeSpill(formData);

      console.log("Backend response:", response);

      if (response.status === "success") {
        setResult(response);
      } else {
        alert("Analysis failed.");
      }

    } catch (error) {
      console.error("Analysis error:", error);
      console.error("Backend response:", error.response?.data);

      alert(
        error.response?.data?.detail
          ? JSON.stringify(error.response.data.detail)
          : "Backend request failed."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="input-panel">

      <h2>Start Analysis</h2>

      <div className="input-grid">

        {/* Satellite Image */}

        <div className="input-group">

          <label>Satellite SAR Image</label>

          <input
            type="file"
            accept=".png,.jpg,.jpeg,.h5,.hdf5,.tif,.tiff"
            onChange={handleFileChange}
          />

          {file && (
            <p>
              Selected: {file.name}
            </p>
          )}

        </div>


        {/* Latitude */}

        <div className="input-group">

          <label>Latitude</label>

          <input
            type="number"
            placeholder="17.25"
            value={latitude}
            onChange={(e) =>
              setLatitude(e.target.value)
            }
          />

        </div>


        {/* Longitude */}

        <div className="input-group">

          <label>Longitude</label>

          <input
            type="number"
            placeholder="82.31"
            value={longitude}
            onChange={(e) =>
              setLongitude(e.target.value)
            }
          />

        </div>


        {/* Date */}

        <div className="input-group">

          <label>Observation Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />

        </div>


        {/* Time */}

        <div className="input-group">

          <label>Observation Time</label>

          <input
            type="time"
            value={time}
            onChange={(e) =>
              setTime(e.target.value)
            }
          />

        </div>


        {/* AIS Window */}

        <div className="input-group">

          <label>AIS Search Window</label>

          <select
            value={aisWindow}
            onChange={(e) =>
              setAisWindow(e.target.value)
            }
          >

            <option value="12">
              12 hours
            </option>

            <option value="24">
              24 hours
            </option>

            <option value="48">
              48 hours
            </option>

            <option value="72">
              72 hours
            </option>

          </select>

        </div>

      </div>


      {/* Analyze Button */}

      <button
        onClick={handleAnalyze}
        disabled={loading}
      >

        {loading
          ? "Analyzing..."
          : "Analyze Spill"}

      </button>


      {/* ================================================= */}
      {/* ANALYSIS RESULT */}
      {/* ================================================= */}

      {result && (

        <div className="analysis-result">

          <h2>
            🛰️ Analysis Result
          </h2>


          {/* Detection */}

          <div className="result-card">

            <h3>Oil Spill Detection</h3>

            <p>

              <strong>Status:</strong>{" "}

              {result.prediction.spill_detected
                ? "🛢️ SPILL DETECTED"
                : "✅ NO SPILL DETECTED"}

            </p>

          </div>


          {/* Spill Area */}

          <div className="result-card">

            <h3>Spill Area</h3>

            <p className="spill-percentage">

              {result.prediction.spill_percentage}%

            </p>

          </div>


          {/* Pixel Information */}

          <div className="result-card">

            <h3>Segmentation Details</h3>

            <p>

              <strong>Spill Pixels:</strong>{" "}
              {result.prediction.spill_pixels.toLocaleString()}

            </p>

            <p>

              <strong>Total Pixels:</strong>{" "}
              {result.prediction.total_pixels.toLocaleString()}

            </p>

          </div>


          {/* Location */}

          <div className="result-card">

            <h3>Observation Location</h3>

            <p>

              <strong>Latitude:</strong>{" "}
              {result.input.latitude}

            </p>

            <p>

              <strong>Longitude:</strong>{" "}
              {result.input.longitude}

            </p>

          </div>


          {/* Observation */}

          <div className="result-card">

            <h3>Observation Details</h3>

            <p>

              <strong>Date:</strong>{" "}
              {result.input.observation_date}

            </p>

            <p>

              <strong>Time:</strong>{" "}
              {result.input.observation_time}

            </p>

            <p>

              <strong>AIS Window:</strong>{" "}
              {result.input.ais_window} hours

            </p>

          </div>


          {/* Model */}

          <div className="result-card">

            <h3>AI Model</h3>

            <p>

              <strong>Segmentation Model:</strong>{" "}
              U-Net

            </p>

          </div>

        </div>

      )}

    </section>
  );
}

export default InputPanel;