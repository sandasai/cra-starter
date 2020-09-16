import React, { useState } from 'react'

const RectangleButton = () => {
  const [rectangleVisible, setRectangleVisible] = useState(false)

  return (
    <>
      <button
        onClick={() => {
          setRectangleVisible(!rectangleVisible)
        }}
      >
        Create Rectangle
      </button>
      {rectangleVisible && <div className="test-rectangle">Rectangle here</div>}
    </>
  )
}

export default RectangleButton
