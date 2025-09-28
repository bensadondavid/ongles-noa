import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

const Entry = lazy(()=>import('./Pages/Entry'))
const Login = lazy(()=>import('./Pages/Login'))
const SignUp = lazy(()=>import('./Pages/SignUp'))
const PrivateRoute = lazy(()=>import('./Components/PrivatePage'))

function App() {

  return (
    <>
      <BrowserRouter>
        <Suspense>
          <Routes>
            <Route path="/" element={<Entry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route element={<PrivateRoute />}>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
