import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

const Entry = lazy(()=>import('./Pages/Entry'))

function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/" element={<Entry />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
