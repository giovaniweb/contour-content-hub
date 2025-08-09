export function sanitizeText(input: string): string {
  if (!input) return input;
  let out = String(input);

  // Remove markdown básico preservando conteúdo
  out = out.replace(/\*\*(.*?)\*\*/g, '$1'); // Remove negrito
  out = out.replace(/\*(.*?)\*/g, '$1'); // Remove itálico
  out = out.replace(/^#+\s*/gm, ''); // Remove títulos markdown
  out = out.replace(/^[\s>*\-•]+/gm, ''); // Remove marcadores

  // Remove divisores visuais
  out = out.replace(/^[-=_]{3,}$/gm, ''); // Remove linhas separadoras
  out = out.replace(/\|/g, ''); // Remove pipes

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
