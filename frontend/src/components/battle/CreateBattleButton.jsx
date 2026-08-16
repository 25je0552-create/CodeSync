import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

function CreateBattleButton({
  battleName,
  difficulty,
  languages,
  duration,
  playerCapacity,
  battleType,
  allowSpectators,
}) {
  const navigate = useNavigate();

  const handleCreateBattle = async () => {

    // Validation

    if (!battleName.trim()) {
      toast.error("Enter a battle name.");
      return;
    }

    if (languages.length === 0) {
      toast.error("Select at least one language.");
      return;
    }

    try {

      const host =
        localStorage.getItem("username");

      const response = await axios.post(
        "http://localhost:5000/api/battle/create",
        {
          battleName,
          difficulty,
          languages,
          duration,
          playerCapacity,
          battleType,
          allowSpectators,
          host,
        }
      );

      toast.success("Battle Created!");

      const { battleId, battle } =
        response.data;

      navigate(
        `/battle/lobby/${battleId}`,
        {
          state: battle,
        }
      );

    } catch (error) {

      console.error(error);

      toast.error(
        error.response?.data?.message ||
        "Failed to create battle."
      );

    }

  };

  return (
    <button
      onClick={handleCreateBattle}
      className="
      w-full
      py-4
      rounded-xl
      bg-blue-600
      hover:bg-blue-700
      text-white
      font-semibold
      text-lg
      transition
      "
    >
      ⚔ Create Battle
    </button>
  );
}

export default CreateBattleButton;