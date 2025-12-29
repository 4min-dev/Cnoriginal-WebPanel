import { Route, Routes } from "react-router-dom"
import Dashboard from "./pages/dashboard/Dashboard"
import Orders from "./pages/orders/Orders"


function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
    </Routes>
  )
}

export default App
