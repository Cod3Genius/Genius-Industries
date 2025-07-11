import { Outlet, createRootRoute, useNavigate } from "@tanstack/react-router"
import React, { Suspense, useEffect } from "react"
import { useUser } from '@clerk/clerk-react'

import NotFound from "@/components/Common/NotFound"
import Navbar from "@/components/Common/Navbar"
import Footer from "@/components/Common/Footer"

const loadDevtools = () =>
  Promise.all([
    import("@tanstack/router-devtools"),
    import("@tanstack/react-query-devtools"),
  ]).then(([routerDevtools, reactQueryDevtools]) => {
    return {
      default: () => (
        <>
          <routerDevtools.TanStackRouterDevtools />
          <reactQueryDevtools.ReactQueryDevtools />
        </>
      ),
    }
  })

const TanStackDevtools =
  process.env.NODE_ENV === "production" ? () => null : React.lazy(loadDevtools)

function RootComponent() {
  const navigate = useNavigate()
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    // Solo redirigir si el usuario se acaba de loguear y está en una página pública
    if (isLoaded && isSignedIn) {
      const currentPath = window.location.pathname
      
      // Si está en páginas de auth o homepage, redirigir al dashboard
      const authPages = ['/sign-in', '/sign-up', '/login', '/signup', '/']
      if (authPages.includes(currentPath)) {
        navigate({ to: '/client-dashboard' })
      }
    }
  }, [isSignedIn, isLoaded, navigate])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <Suspense>
        <TanStackDevtools />
      </Suspense>
    </div>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
})
