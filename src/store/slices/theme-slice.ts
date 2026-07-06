import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const STORAGE_KEY = "theme-preference"

export type ThemePreference = "light" | "dark" | "system"

interface ThemeState {
  preference: ThemePreference;
  systemTheme: "light" | "dark";
}

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

const getInitialPreference = (): ThemePreference => {
  if (typeof window === "undefined") return "system"
  const saved = localStorage.getItem(STORAGE_KEY)
  return (saved as ThemePreference) || "system"
}

const initialState: ThemeState = {
  preference: getInitialPreference(),
  systemTheme: getSystemTheme(),
}

const applyTheme = (preference: ThemePreference, systemTheme: "light" | "dark") => {
  if (typeof window === "undefined") return
  const activeTheme = preference === "system" ? systemTheme : preference
  const root = document.documentElement
  if (activeTheme === "dark") {
    root.classList.add("dark")
    root.classList.remove("light")
  } else {
    root.classList.add("light")
    root.classList.remove("dark")
  }
}

// Perform initial DOM manipulation on script load
applyTheme(getInitialPreference(), getSystemTheme())

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    initTheme: (state) => {
      state.preference = getInitialPreference()
      state.systemTheme = getSystemTheme()
      applyTheme(state.preference, state.systemTheme)
    },
    setSystemTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.systemTheme = action.payload
      applyTheme(state.preference, state.systemTheme)
    },
    setPreference: (state, action: PayloadAction<ThemePreference>) => {
      const preference = action.payload
      state.preference = preference
      localStorage.setItem(STORAGE_KEY, preference)
      applyTheme(preference, state.systemTheme)
    },
    toggleTheme: (state) => {
      const activeTheme = state.preference === "system" ? state.systemTheme : state.preference
      const newPreference = activeTheme === "dark" ? "light" : "dark"
      state.preference = newPreference
      localStorage.setItem(STORAGE_KEY, newPreference)
      applyTheme(newPreference, state.systemTheme)
    },
  },
})

export const { initTheme, setSystemTheme, setPreference, toggleTheme } = themeSlice.actions

// Listen to system preference changes at module level inside slice
if (typeof window !== "undefined") {
  const media = window.matchMedia("(prefers-color-scheme: dark)")
  const handleSystemThemeChange = async () => {
    const activeSystemTheme = media.matches ? "dark" : "light"
    const { store } = await import("../store")
    store.dispatch(setSystemTheme(activeSystemTheme))
  }
  media.addEventListener("change", handleSystemThemeChange)
}

export const selectActiveTheme = (state: { theme: ThemeState }) => {
  return state.theme.preference === "system" ? state.theme.systemTheme : state.theme.preference
}

export default themeSlice.reducer
