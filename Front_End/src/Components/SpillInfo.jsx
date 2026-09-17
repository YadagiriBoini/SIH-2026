function SpillInfo() {
  return (
    <section className="info-grid">

      <div className="info-card">
        <span>Spill Status</span>
        <strong>Waiting</strong>
      </div>

      <div className="info-card">
        <span>Spill Area</span>
        <strong>-- km²</strong>
      </div>

      <div className="info-card">
        <span>Detection Confidence</span>
        <strong>--%</strong>
      </div>

      <div className="info-card">
        <span>Candidate Vessels</span>
        <strong>--</strong>
      </div>

    </section>
  );
}

export default SpillInfo;