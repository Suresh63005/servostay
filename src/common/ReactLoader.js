import React from 'react'
import "./LoaderComponent.css"
import { FadeLoader } from 'react-spinners';
const LoaderComponent = (props) => {

  return (
    <>
  
      <div className='popup-overlay'>
          <div className="popup-content">
            <FadeLoader
              color={'#00FFA1'}
              loading={props.loading}
            
              aria-label="Loading Spinner"
              data-testid="loader"
            />
        </div>

      </div>
    </>

  )
}

export default LoaderComponent
