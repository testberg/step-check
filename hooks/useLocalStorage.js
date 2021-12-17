/**
 * useLocalStorage 
 * @returns  {
    getLocalSteps,
    setLocalSteps
  }
 */
const useLocalStorage = () => {
  const isBrowser = process.browser;

  const getLocalSteps = () => {
    return isBrowser ? JSON.parse(localStorage.getItem("steps")) : null;
  };

  const setLocalSteps = (value) => {
    if (isBrowser) {
      localStorage.setItem("steps", JSON.stringify(value));
      return true;
    }

    return false;
  };

  return {
    getLocalSteps,
    setLocalSteps,
  };
};

export default useLocalStorage;
