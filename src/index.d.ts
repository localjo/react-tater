import { ReactNode } from 'react';

interface TaterOptions {
  name?: string;
  space?: number;
}

interface TaterProps {
  options?: TaterOptions;
  children: ReactNode;
}

declare const Tater: (props: TaterProps) => JSX.Element;

export default Tater;

export { TaterProps };

