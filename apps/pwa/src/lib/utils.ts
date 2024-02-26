import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export function shortenText(text: string, length: number): string {
  if (text.length <= length) {
    return text;
  }

  const prefixLength = Math.ceil((length - 3) / 2);
  const suffixLength = length - 3 - prefixLength;
  
  return `${text.substring(0, prefixLength)}...${text.substring(text.length - suffixLength)}`;
}