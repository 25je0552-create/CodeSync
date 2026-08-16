import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function JoinBattle() {

  const navigate = useNavigate();

  const [battleId, setBattleId] =
    useState("");

  const username =
    localStorage.getItem("username");

  const joinBattle = async () => {

    if (!battleId.trim()) {

      toast.error(
        "Enter Battle ID"
      );

      return;

    }

    try {

      await axios.post(
        "http://localhost:5000/api/battle/join",
        {

          battleId,

          username,

        }
      );

      toast.success(
        "Joined Battle!"
      );

      navigate(
        `/battle/lobby/${battleId}`
      );

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        "Failed to join battle."

      );

    }

  };

  return (

    <div className="min-h-screen bg-[#F6F8FB] flex items-center justify-center">

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 w-[500px]">

        <h1 className="text-4xl font-bold">

          🎯 Join Battle

        </h1>

        <p className="text-slate-500 mt-2">

          Enter the Battle ID shared by the host.

        </p>

        <input

          value={battleId}

          onChange={(e)=>

            setBattleId(e.target.value.toUpperCase())

          }

          placeholder="Battle ID"

          className="
          mt-8
          w-full
          border
          border-slate-300
          rounded-xl
          px-4
          py-4
          outline-none
          focus:border-blue-600
          "

        />

        <button

          onClick={joinBattle}

          className="
          mt-8
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          rounded-xl
          py-4
          font-semibold
          "

        >

          Join Battle

        </button>

      </div>

    </div>

  );

}

export default JoinBattle;