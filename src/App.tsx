import { RouterProvider } from 'react-router-dom'
import './styles/footer.component.css'
import Router from './router/Router'

function App() {

  return (
    <>
        <RouterProvider router={Router} />
    </>
  )
}

export default App
