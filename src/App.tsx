import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import RootLayout from './layout/RootLayout'

function App() {
  return (
    <div>
      <RootLayout>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router} />
          </SocketProvider>
        </AuthProvider>
      </RootLayout>
    </div>
  )
}

export default App
