import {useRef}from 'react'

export interface IRenderCounterProps {
  id?: any
}
export const RenderCounter = ({ id }: IRenderCounterProps) => {
  const counter = useRef(1)
  if (id === 2) {
    // console.log(`rendering ${id}: ${counter.current}`)
  }
  return <>{counter.current++}</>
}
