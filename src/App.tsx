import { RouterProvider } from 'react-router-dom'
import './styles/footer.component.css'
import { Router } from './router/Router';
import MsalProviderWithHistory from './providers/MsalProvider'
import UserProvider from './providers/userProvider'

function App() {
  return (
    <>
      <MsalProviderWithHistory>
        <UserProvider>
          <RouterProvider router={Router} />
        </UserProvider>
      </MsalProviderWithHistory>
    </>
  )
}

export default App
