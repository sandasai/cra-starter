import React from 'react'

interface Props {
  label: string
  name: string
  options: string[]
}

const SwSelectInput = React.forwardRef((props: Props, ref: any) => {
  const { label, name, options } = props
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <div className="select">
          <select name={name} ref={ref}>
            {options.map(option => {
              return <option key={option}>{option}</option>
            })}
          </select>
        </div>
      </div>
    </div>
  )
})

export default SwSelectInput
