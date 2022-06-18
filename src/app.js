import React from "react"
import {createRoot} from "react-dom/client"
import {BrowserRouter as Router, Route, Routes, useLocation, Navigate} from "react-router-dom"
import {CssBaseline, Box} from "@mui/material"
import {createTheme, ThemeProvider, responsiveFontSizes} from "@mui/material/styles"
import {Index} from "./pages"

const
  App = () => {
    return <ThemeProvider theme={responsiveFontSizes(createTheme({}))}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
        </Routes>
      </Router>
    </ThemeProvider>
  }

createRoot(document.getElementById("app")).render(<App />)
