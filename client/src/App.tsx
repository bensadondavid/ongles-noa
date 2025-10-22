import { BrowserRouter, Routes, Route } from "react-router-dom"
import { lazy, Suspense } from "react"

const Entry = lazy(()=>import('./Pages/Entry'))
const Login = lazy(()=>import('./Pages/Login'))
const SignUp = lazy(()=>import('./Pages/SignUp'))
const PrivateRoute = lazy(()=>import('./Components/PrivatePage'))
const Prestations = lazy(()=>import('./Pages/Prestations'))
const Options = lazy((()=>import('./Pages/Options')))
const Creneaux = lazy(()=>import('./Pages/Crenaux'))

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
              <Route path="/prestations" element={<Prestations />} />
              <Route path="/options" element={<Options />} />
              <Route path="/crenaux" element={<Creneaux />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App
