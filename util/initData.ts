export const LSKeys = {
  token: "token",
  callBack: "callBack",
  riaseAssmt: "riaseAssmt",
};

export const clearLSItem = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
