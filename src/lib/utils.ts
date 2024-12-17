import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { genSaltSync, hashSync } from "bcryptjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const encodeString = (text: string) => {
  const salt = genSaltSync(10);
  const hashedPassword = hashSync(text, salt);

  return { hashedPassword, salt };
};

export const searchParams = () =>
  new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  });
