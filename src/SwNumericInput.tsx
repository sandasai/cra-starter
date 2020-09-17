import React from 'react'

interface Props {
  label: string
  name: string
}

const SwNumericInput = React.forwardRef((props: Props, ref: any) => {
  const { label, name } = props
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">
        <input className="input" name={name} type="number" ref={ref} min={0} />
      </div>
    </div>
  )
})

export default SwNumericInput
