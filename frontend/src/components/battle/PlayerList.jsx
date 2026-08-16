function PlayerList({

    players,

}) {

  return (

    <div className="bg-white rounded-3xl border border-slate-200 p-8">

      <h2 className="text-2xl font-bold">

        Players

      </h2>

      <div className="space-y-4 mt-6">

        {players.map((player,index)=>(

          <div
            key={index}
            className="flex justify-between items-center bg-slate-50 rounded-xl px-5 py-4"
          >

            <div>

              <p className="font-semibold">

                {index===0 && "👑 "}

                {player.username}

              </p>

            </div>

            <span>

              {player.ready
                ? "🟢 Ready"
                : "🔴 Not Ready"}

            </span>

          </div>

        ))}

        {players.length===1 && (

          <div className="text-slate-500 mt-6">

            Waiting for players...

          </div>

        )}

      </div>

    </div>

  );

}

export default PlayerList;