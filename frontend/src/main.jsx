import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router'
import './index.css'
import App from './App.jsx'
import { CustomerService } from './components/CustomerService.jsx'
import { User } from './components/User.jsx'

// 1. Bikin Root Route (Bungkus utamanya)
const rootRoute = createRootRoute()

// 2. Definisi Path-nya (Pindah dari <Route> ke sini)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: App,
})

const ticketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: CustomerService,
})

const submitRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ticket-submit',
  component: User,
})

// 3. Gabungin semua route jadi "Tree"
const routeTree = rootRoute.addChildren([indexRoute, ticketsRoute, submitRoute])

// 4. Bikin instance router-nya
const router = createRouter({ routeTree })

// 5. Render pake RouterProvider-nya TanStack
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)