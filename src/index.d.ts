declare module 'react-tater' {
  import React from 'react';

  interface ReactTaterProps {
    name?: string
    space?: number
    children: React.Element
  }

  const Tater: (props: ReactTaterProps) => ReactElement<ReactTaterProps>

  export default Tater
}
