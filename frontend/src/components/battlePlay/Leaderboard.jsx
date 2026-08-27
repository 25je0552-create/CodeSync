function Leaderboard({ leaderboard = [] }) {
  const safeList = Array.isArray(leaderboard) ? leaderboard : [];

  return (
    <div className="bg-[#141414] border border-[#262626] p-6 h-full rounded-none flex flex-col justify-between font-bugatti-mono">
      <div>
        <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-4">
          <h2 className="font-bugatti-display text-xl tracking-[2px] text-white uppercase">
            LIVE SCOREBOARD
          </h2>
          <span className="text-[10px] uppercase tracking-[1.5px] text-[#5fa657]">
            REALTIME SYNC
          </span>
        </div>

        {safeList.length === 0 ? (
          <div className="border border-[#262626] bg-[#000000] p-4 text-xs text-[#999999] uppercase tracking-[1.5px] text-center">
            NO SUBMISSIONS YET
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {safeList.map((item, index) => (
              <div
                key={item.username || index}
                className="bg-[#000000] border border-[#262626] p-3 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-bold border ${
                      item.rank === 1
                        ? "border-[#d4a017] text-[#d4a017] bg-[#d4a017]/10"
                        : item.rank === 2
                        ? "border-[#cccccc] text-[#cccccc]"
                        : "border-[#262626] text-[#666666]"
                    }`}
                  >
                    #{item.rank || index + 1}
                  </span>

                  <div>
                    <span className="font-semibold text-white uppercase tracking-[1px]">
                      {item.username || "PLAYER"}
                    </span>
                    <div className="text-[10px] text-[#666666] tracking-[1px] uppercase mt-0.5">
                      SOLVED: {item.solvedCount || 0}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-[#5fa657] tracking-[1.5px]">
                    {item.score || 0} PTS
                  </div>
                  <div className="text-[9px] text-[#666666] uppercase tracking-[1px]">
                    {item.connected !== false ? "ONLINE" : "OFFLINE"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-[#262626] text-[10px] uppercase tracking-[1.5px] text-[#666666] text-center">
        RANKED BY SCORE DESC · TIE-BREAK BY TIME ASC
      </div>
    </div>
  );
}

export default Leaderboard;