const GameSettings = () => {
  return (
    <div className="settings-panel">
      <select onChange={handleBoardSize}>
        <option value="3">3x3</option>
        <option value="4">4x4</option>
        <option value="5">5x5</option>
      </select>
      <input type="number" placeholder="Time limit per move" />
      {/* Add more settings */}
    </div>
  );
};
