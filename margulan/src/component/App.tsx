import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import Loader from './Loader/Loader';
import useUser from '../contexts/UserContext/useUser';
import Header from './Header/Header';
import { useAppContext } from '../contexts/AppContext';
import Sign from './Sign/Sign';
import Signup from './Sign/Signup';
import Profile from './Profile/Profile';
import { Route, Routes } from 'react-router-dom';
import Host from './Host/Host';
import Join from './Join/Join';
import HostLobby from './HostLobby/HostLobby';
import Game from './Game/Game';
import WaitLobby from './WaitLobby/WaitLobby';


function App() {

  const { loading, user } = useUser();
  const { theme } = useAppContext();

  const [isSign, setSignstatus] = useState(true)

  if (loading) {
    return <Loader />
  }

  return (
    <div className={`${styles.app} ${styles[theme]}`}>
      <Header />
      <Routes>
        <Route path="/" element={
          <>
            {
              user ? 

              <Profile />

              :

              isSign ?

              <Sign toSignup={() => setSignstatus(false)} />

              :

              <Signup toSignin={() => setSignstatus(true)} />
            }
          </>
        } />

        <Route path='host' element={<Host />} />
        <Route path='join' element={<Join />} />
        <Route path='wait' element={<WaitLobby />} />
        <Route path='hosts/:hostId' element={<HostLobby />} />
        <Route path='games/:gameId' element={<Game />} />
        
      </Routes>
      

    </div>
  );
}

export default App;
