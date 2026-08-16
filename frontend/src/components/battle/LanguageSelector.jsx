import toast from "react-hot-toast";

function LanguageSelector({ languages, setLanguages }) {
  const availableLanguages = [
    { id: "cpp", label: "C++" },
    { id: "java", label: "JAVA" },
    { id: "python", label: "PYTHON" },
    { id: "javascript", label: "JAVASCRIPT" },
    { id: "c", label: "C" },
  ];

  const toggleLanguage = (id) => {
    if (languages.includes(id)) {
      if (languages.length === 1) {
        toast.error("Select at least one language.");
        return;
      }
      setLanguages(languages.filter((lang) => lang !== id));
    } else {
      setLanguages([...languages, id]);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {availableLanguages.map((lang) => (
        <button
          key={lang.id}
          type="button"
          onClick={() => toggleLanguage(lang.id)}
          className={`
            py-3
            font-bugatti-mono
            text-xs
            uppercase
            tracking-[2px]
            border
            rounded-none
            transition-all
            cursor-pointer
            ${
              languages.includes(lang.id)
                ? "bg-white text-black border-white"
                : "bg-transparent text-[#999999] border-[#262626] hover:border-[#3a3a3a] hover:text-white"
            }
          `}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}

export default LanguageSelector;