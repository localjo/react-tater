import { ReactElement } from 'react';

interface TaterOptions {
  name?: string;
  space?: number;
}

interface TaterProps {
  options?: TaterOptions;
  children: ReactElement;
}

declare const Tater: (props: TaterProps) => JSX.Element;

export default Tater;

export { TaterProps };

