export function makeTitleCase(string) {
  if (typeof string !== "string") return "";

  return string
    .trim()
    .split(/\s+/)
    .map((word) =>
      word
        .split("-")
        .map(
          (subword) =>
            subword.charAt(0).toUpperCase() + subword.slice(1).toLowerCase()
        )
        .join("-")
    )
    .join(" ");
}
