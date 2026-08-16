function PlayerList({ players }) {
  return (
    <div className="bg-[#141414] border border-[#262626] p-8 rounded-none">
      <h2 className="font-bugatti-display text-2xl tracking-[2px] text-white uppercase">
        PLAYERS ({players.length})
      </h2>

      <div className="space-y-3 mt-6">
        {players.map((player, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[#000000] border border-[#262626] px-5 py-4 font-bugatti-mono text-xs uppercase tracking-[1.5px]"
          >
            <div className="flex items-center gap-2">
              {index === 0 && <span className="text-white">HOST //</span>}
              <span className="text-white">{player.username}</span>
            </div>

            <span className={player.ready ? "text-[#5fa657]" : "text-[#999999]"}>
              {player.ready ? "READY" : "NOT READY"}
            </span>
          </div>
        ))}

        {players.length === 1 && (
          <div className="font-bugatti-serif text-[#999999] italic mt-6 text-center">
            Waiting for additional competitors to join...
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerList;