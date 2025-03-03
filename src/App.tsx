import { RouterProvider } from 'react-router-dom'
import './styles/footer.component.css'
import { Router } from './router/Router';
import Auth0ProviderWithHistory from './providers/auth0Provider'
import UserProvider from './providers/userProvider'

function App() {

  return (
    <>
      <Auth0ProviderWithHistory>
        <UserProvider>
          <RouterProvider router={Router} />
        </UserProvider>
      </Auth0ProviderWithHistory>
    </>
  )
}

export default App
