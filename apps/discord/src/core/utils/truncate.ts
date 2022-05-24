export function truncate(input: string, maxLength = 8) {
  if (input.length > maxLength) {
    return `${input.substring(0, 3)}...${input.substring(
      input.length - 3,
      input.length,
    )}`;
  }
  return input;
}
