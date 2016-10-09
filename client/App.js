import React, { Component } from 'react'
import Headroom from 'react-headroom'
import Navbar from './components/navbar/Navbar'


const App = (props) => {
  const is_fluid = false,
        wrapperStyle = is_fluid ? {}:{marginBottom: '20px'},
        mainContainer_className = is_fluid ? 'container-fluid positionRelative' : 'container positionRelative';

  return(
    <div>
      <Headroom wrapperStyle={wrapperStyle}>
        <Navbar />
      </Headroom>
      <div className={mainContainer_className} >
        {React.cloneElement(props.children || <div />, {})}
      </div>
    </div>
  )
}

export default App
