import { createElement } from "react";
import Link from "next/link";

export function renderRichText(text: string) {
  const tokenRegex = /((?:https?:\/\/|www\.)[^\s]+)|(@[a-zA-Z0-9_]+)/g;
  const parts = text.split(tokenRegex).filter((p) => p !== undefined && p !== "");

  return parts.map((part, i) => {
    if (/^(?:https?:\/\/|www\.)/.test(part)) {
      const href = part.startsWith("http") ? part : `https://${part}`;
      return createElement(
        "a",
        {
          key: i,
          href: href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "break-all text-blue-600 underline dark:text-blue-400",
        },
        part
      );
    }
    if (/^@[a-zA-Z0-9_]+$/.test(part)) {
      const username = part.slice(1);
      return createElement(
        Link,
        {
          key: i,
          href: `/u/${username}`,
          className: "font-medium text-blue-600 hover:underline dark:text-blue-400",
        },
        part
      );
    }
    return createElement("span", { key: i }, part);
  });
}