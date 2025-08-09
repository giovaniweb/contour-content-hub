export function sanitizeText(input: string): string {
  if (!input) return input;
  let out = String(input);

  // Padrões proibidos (variações e case-insensitive)
  const patterns: RegExp[] = [
    /do\s+jeito\s+ladeira/gi,
    /ladeira\s*copy\s*warrior/gi,
    /copywarrior/gi,
    /—?\s*do\s+jeito\s+ladeira[^\n]*/gim,
  ];

  patterns.forEach((rx) => {
    out = out.replace(rx, "");
  });

  // Remover alguns emojis/ruídos associados
  out = out.replace(/[💰💵💸]+/g, "");

  // Espaços e quebras extras
  out = out
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s{2,}/g, " ")
    .trim();

  return out;
}
