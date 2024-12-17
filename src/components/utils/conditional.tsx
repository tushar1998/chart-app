import type { PropsWithChildren } from "react";
import { Children } from "react";

interface ConditionalProps {
  satisfies?: null | unknown | boolean;
}

const Conditional = ({ children, satisfies }: PropsWithChildren<ConditionalProps>) => {
  const [truthy, falsy] = Children.toArray(children);

  return satisfies ? truthy : falsy;
};

Conditional.displayName = Conditional.name;

export default Conditional;
