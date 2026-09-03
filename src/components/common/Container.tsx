import type { PropsWithChildren } from "react";

interface ContainerProps extends PropsWithChildren {
  className?: string;
}

const Container = ({
  children,
  className = "",
}: ContainerProps) => {
  return (
    <div
      className={`mx-auto w-full max-w-[1536px] px-5 sm:px-6 lg:px-8 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;