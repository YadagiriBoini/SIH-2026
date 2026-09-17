function Navbar() {
  return (
    <nav className="navbar">
      <div>
        <h1>Oil Spill Detection & Attribution</h1>
        <p>Satellite + AIS Intelligence System</p>
      </div>

      <div className="status">
        <span className="status-dot"></span>
        System Ready
      </div>
    </nav>
  );
}

export default Navbar;