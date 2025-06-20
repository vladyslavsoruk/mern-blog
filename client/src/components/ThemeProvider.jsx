import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="bg-white text-gray-700 dark:text-gray-200 dark:bg-[rgb(16,23,42)]">
      {children}
    </div>
  );
}

export default ThemeProvider;
