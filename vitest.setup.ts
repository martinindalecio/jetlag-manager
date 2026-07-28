import "@testing-library/jest-dom";

// Fix jsdom's localStorage initialization
if (typeof window !== "undefined" && typeof window.localStorage !== "undefined") {
  const storageData: Record<string, string> = {};

  if (!window.localStorage.getItem) {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem(key: string) {
          return storageData[key] ?? null;
        },
        setItem(key: string, value: string) {
          storageData[key] = String(value);
        },
        removeItem(key: string) {
          delete storageData[key];
        },
        clear() {
          for (const key in storageData) {
            delete storageData[key];
          }
        },
        key(index: number) {
          const keys = Object.keys(storageData);
          return keys[index] ?? null;
        },
        get length() {
          return Object.keys(storageData).length;
        },
      } as Storage,
      writable: false,
    });
  }
}
