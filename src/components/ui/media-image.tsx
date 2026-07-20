"use client";

import Image, { type ImageProps } from "next/image";

/**
 * Media from the API (`/uploads/...`) often fails Next's optimizer in local
 * multi-port setups. Skip optimization for absolute http(s) URLs.
 */
export function shouldBypassImageOptimizer(src: string): boolean {
  return /^https?:\/\//i.test(src);
}

type Props = Omit<ImageProps, "src"> & {
  src: string;
};

export function MediaImage({ src, alt, ...props }: Props) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      unoptimized={
        props.unoptimized ?? shouldBypassImageOptimizer(src)
      }
    />
  );
}
