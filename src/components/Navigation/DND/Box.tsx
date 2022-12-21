import type { CSSProperties, FC } from 'react'
import { memo } from 'react'
import { useDrag } from 'react-dnd'

export interface BoxProps {
  children: React.ReactNode | React.ReactNode[];
  name: string
  type: number;
}

const Box: FC<BoxProps> = memo(function Box({ children, name, type }) {
  const [{ opacity }, drag] = useDrag(
    () => ({
      type: String(type),
      item: { name, type },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [name, type],
  )

  return (
    <div ref={drag} style={{ opacity }} data-testid="box">
      {children}
    </div>
  )
})

export default Box;