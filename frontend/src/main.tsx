import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { Dashboard } from './pages/Dashboard'
import { Playground } from './pages/Playground'
import { Training } from './pages/Training'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route index element={<Dashboard />} />
          <Route path="playground" element={<Playground />} />
          <Route path="training" element={<Training />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
