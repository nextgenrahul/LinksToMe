import { Suspense, type ElementType, type ComponentProps } from 'react';
import Fallback from './Fallback';

const Loadable = (Component: ElementType) => (props: ComponentProps<typeof Component>) => (
  <Suspense fallback={<Fallback />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;