import * as React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: any;
  alt: string;
};

export default function Image({ src, alt, ...rest }: Props) {
  const resolvedSrc = typeof src === "string" ? src : (src?.src ?? "");
  return <img src={resolvedSrc} alt={alt} {...rest} />;
}
