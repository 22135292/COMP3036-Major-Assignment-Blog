import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <>
      <div className="sr-only">{props.title}</div>
      {props.children}
    </>
  );
}
