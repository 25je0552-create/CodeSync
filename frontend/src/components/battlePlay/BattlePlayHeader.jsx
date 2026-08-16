import { useEffect, useState } from "react";
import axios from "axios";

function BattlePlayHeader({

  battleId,

}) {

  const [battle, setBattle] =
    useState(null);

  useEffect(() => {

    const fetchBattle = async () => {

      try {

        const response =
          await axios.get(

            `http://localhost:5000/api/battle/${battleId}`

          );

        setBattle(
          response.data.battle
        );

      } catch (error) {

        console.error(error);

      }

    };

    fetchBattle();

  }, [battleId]);

  if (!battle) {

    return (

      <div className="bg-white rounded-3xl border border-slate-200 p-8">

        Loading...

      </div>

    );

  }

  return (

    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

      {/* First Row */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">

            ⚔ {battle.battleName}

          </h1>

          <p className="text-slate-500 mt-2">

            Battle ID : {battle.battleId}

          </p>

        </div>

        <div className="text-right">

          <div className="text-2xl font-bold">

            ⏱ 30:00

          </div>

          <div
            className="
            text-green-600
            font-semibold
            mt-2
            "
          >
            🟢 {battle.status}
          </div>

        </div>

      </div>

      {/* Second Row */}

      <div className="grid grid-cols-4 gap-6 mt-8">

        <div>

          <p className="text-slate-500 text-sm">

            Difficulty

          </p>

          <h3 className="font-semibold capitalize mt-1">

            🔥 {battle.difficulty}

          </h3>

        </div>

        <div>

          <p className="text-slate-500 text-sm">

            Languages

          </p>

          <h3 className="font-semibold mt-1">

            {battle.languages.join(", ")}

          </h3>

        </div>

        <div>

          <p className="text-slate-500 text-sm">

            Players

          </p>

          <h3 className="font-semibold mt-1">

            {battle.players.length}

            {" / "}

            {battle.playerCapacity}

          </h3>

        </div>

        <div>

          <p className="text-slate-500 text-sm">

            Host

          </p>

          <h3 className="font-semibold mt-1">

            👑 {battle.host}

          </h3>

        </div>

      </div>

    </div>

  );

}

export default BattlePlayHeader;