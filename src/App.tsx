import { RouterProvider } from "react-router-dom";
import "./styles/footer.component.css";
import { Router } from "./router/Router";
import MsalProviderWithHistory from "./providers/MsalProvider";
import NotificationProvider from "./providers/NotificationProvider";
import UserProvider from "./providers/userProvider";

function App() {
  return (
    <>
      <MsalProviderWithHistory>
        <UserProvider>
          <NotificationProvider>
            <RouterProvider router={Router} />
          </NotificationProvider>
        </UserProvider>
      </MsalProviderWithHistory>
    </>
  );
}

export default App;
