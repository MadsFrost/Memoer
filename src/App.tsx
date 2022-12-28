import React from 'react';
import Layout from './components/Layout';

import Setup from './pages/Setup';
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/index';
import { useAppSelector } from './hooks';
import Home from './pages/Home';
import Todos from './pages/Todos';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import mikael from './assets/mikael.jpeg';
function App() {
  const user = useAppSelector(state => state.client.user);
  const router = createBrowserRouter([
    {
      path: '/setup',
      element: (
        <Setup />
      )
    },
    {
      path: '/',
      element: ( 
        <ProtectedRoute user={user}>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute> 
      )
    },
    {
      path: '/todos',
      element: ( 
        <ProtectedRoute user={user}>
          <Layout>
            <Todos />
          </Layout>
        </ProtectedRoute> 
      )
    }
  ])

  return (
    <div className="App min-h-screen bg-cover bg-no-repeat bg-center" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0, 0.4), rgba(0,0,0, 0.5)),
    url(''https://cdn.britannica.com/94/101794-050-A98A953E/Lighthouse-Portsmouth-NH.jpg')`
  }}>
    <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </DndProvider>
    </div>
  );
}

export default App;
