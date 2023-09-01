import './App.scss'
import "bootstrap/dist/js/bootstrap.bundle"
import Routes from "./pages/Routes"
import { ToastContainer } from 'react-toastify'
import { useAuthContext } from './contexts/AuthContext'


function App() {

  const { isAppLoading } = useAuthContext()

  if (isAppLoading)
    return (
      <div className="loader-container">
        <span className="loader"></span>
      </div>
    )
  return (
    <>

      <Routes />



      <ToastContainer
        position="left-bottom"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      ></ToastContainer>

    </>
  );
}

export default App;
