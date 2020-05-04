declare module 'react-tater' {
  import React from 'react';

  interface ReactTaterProps {
    name?: string
    space?: number
  }

  const Tater: (props: ReactTaterProps) => React.SFC<ReactTaterProps>

  export default Tater
}