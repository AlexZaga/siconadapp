import React from 'react'
import Main from './src/views/Main'
import { ContextProvider } from './src/helpers/Context'

export default function App() {

  return (
    <ContextProvider>
      <Main />
    </ContextProvider>
    
  )
}

