import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

const Entry = lazy(()=>import('./Pages/Entry'))
const Login = lazy(()=>import('./Pages/Login'))
const SignIn = lazy(()=>import('./Pages/SignIn'))

function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/log-in" element={<Login />} />
            <Route path="/sign-in" element={<SignIn />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
