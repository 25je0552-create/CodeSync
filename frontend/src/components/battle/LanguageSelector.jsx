import toast from "react-hot-toast";
function LanguageSelector({
  languages,
  setLanguages,
}) {
  const availableLanguages = [
    {
      id: "cpp",
      label: "C++",
    },
    {
      id: "java",
      label: "Java",
    },
    {
      id: "python",
      label: "Python",
    },
    {
      id: "javascript",
      label: "JavaScript",
    },
    {
      id: "c",
      label: "C",
    },
  ];

  const toggleLanguage = (id) => {

  if (languages.includes(id)) {

    if (languages.length === 1) {
      toast.error(
        "Select at least one language."
      );
      return;
    }

    setLanguages(
      languages.filter(
        (lang) => lang !== id
      )
    );

  } else {

    setLanguages([
      ...languages,
      id,
    ]);

  }
};

  return (
    <div className="grid grid-cols-2 gap-3">
      {availableLanguages.map((lang) => (
        <button
          key={lang.id}
          onClick={() =>
            toggleLanguage(lang.id)
          }
          className={`
            py-3
            rounded-xl
            border
            font-semibold
            transition-all

            ${
              languages.includes(lang.id)
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white text-slate-700 border-slate-300 hover:bg-blue-50 hover:border-blue-500"
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