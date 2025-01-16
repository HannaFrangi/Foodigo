import React, { Suspense, useEffect, useState } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { Toaster } from 'react-hot-toast'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [loading, setLoading] = useState(true) // Loading state to prevent rendering until user check is complete
  const authUser = useSelector((state) => state.authUser)
  const dispatch = useDispatch()

  useEffect(() => {
    // Function to check user
    const checkUser = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are included
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const result = await response.json()
        if (response.ok) {
          dispatch({ type: 'setAuthUser', payload: result.user }) // Save user in Redux
        } else {
          dispatch({ type: 'setAuthUser', payload: null }) // Clear user in Redux if not authenticated
        }
      } catch (error) {
        console.error('Error validating user:', error)
        dispatch({ type: 'setAuthUser', payload: null }) // Clear user in Redux on error
      } finally {
        setLoading(false) // Ensure app renders after the check
      }
    }

    checkUser()

    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    // Show a spinner while user check is ongoing
    return (
      <div className="pt-3 text-center">
        <CSpinner color="primary" variant="grow" />
      </div>
    )
  }

  return (
    <>
      <Toaster />
      <HashRouter>
        <Suspense
          fallback={
            <div className="pt-3 text-center">
              <CSpinner color="primary" variant="grow" />
            </div>
          }
        >
          <Routes>
            <Route
              exact
              path="/login"
              name="Login Page"
              element={authUser ? <Navigate to="/" /> : <Login />} // Redirect to home if already logged in
            />
            {/* <Route
            exact
            path="/register"
            name="Register Page"
            element={authUser ? <Navigate to="/" /> : <Register />} // Redirect to home if already logged in
          /> */}
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route
              path="*"
              name="Home"
              element={authUser ? <DefaultLayout /> : <Navigate to="/login" />} // Redirect to login if not authenticated
            />
          </Routes>
        </Suspense>
      </HashRouter>
    </>
  )
}

export default App
