#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const MATERIAL_TYPES = ["raw", "manufactured", "encoded"];

function printUsage() {
  console.error(
    "Usage: node convert-materials.mjs --raw <file> --manufactured <file> " +
      "--encoded <file> --output <file>",
  );
}

function readArguments(argumentsList) {
  const values = {};

  for (let index = 0; index < argumentsList.length; index += 2) {
    const option = argumentsList[index];
    const value = argumentsList[index + 1];

    if (!option?.startsWith("--") || value === undefined) {
      throw new Error(`Invalid argument near ${option ?? "the end of the command"}`);
    }

    values[option.slice(2)] = value;
  }

  for (const required of [...MATERIAL_TYPES, "output"]) {
    if (!values[required]) {
      throw new Error(`Missing --${required}`);
    }
  }

  return values;
}

function removeComments(jsonc) {
  let result = "";
  let inString = false;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let index = 0; index < jsonc.length; index += 1) {
    const character = jsonc[index];
    const nextCharacter = jsonc[index + 1];

    if (inLineComment) {
      if (character === "\n" || character === "\r") {
        inLineComment = false;
        result += character;
      } else {
        result += " ";
      }
      continue;
    }

    if (inBlockComment) {
      if (character === "*" && nextCharacter === "/") {
        result += "  ";
        index += 1;
        inBlockComment = false;
      } else {
        result += character === "\n" || character === "\r" ? character : " ";
      }
      continue;
    }

    if (inString) {
      result += character;

      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      result += character;
    } else if (character === "/" && nextCharacter === "/") {
      result += "  ";
      index += 1;
      inLineComment = true;
    } else if (character === "/" && nextCharacter === "*") {
      result += "  ";
      index += 1;
      inBlockComment = true;
    } else {
      result += character;
    }
  }

  if (inBlockComment) {
    throw new Error("Unterminated block comment in JSONC input");
  }

  return result;
}

function removeTrailingCommas(json) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < json.length; index += 1) {
    const character = json[index];

    if (inString) {
      result += character;

      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') {
      inString = true;
      result += character;
      continue;
    }

    if (character === ",") {
      let lookAhead = index + 1;
      while (/\s/.test(json[lookAhead] ?? "")) {
        lookAhead += 1;
      }

      if (json[lookAhead] === "]" || json[lookAhead] === "}") {
        continue;
      }
    }

    result += character;
  }

  return result;
}

function parseJsonc(text, filePath) {
  try {
    return JSON.parse(removeTrailingCommas(removeComments(text)));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not parse ${filePath}: ${message}`);
  }
}

function validateEntry(entry, type, index, filePath) {
  if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
    throw new Error(`${filePath}: entry ${index} is not an object`);
  }

  if (typeof entry.symbol !== "string" || entry.symbol.length === 0) {
    throw new Error(`${filePath}: entry ${index} has an invalid symbol`);
  }

  if (typeof entry.name !== "string" || entry.name.length === 0) {
    throw new Error(`${filePath}: ${entry.symbol} has an invalid name`);
  }

  if (
    entry.elementSymbol !== null &&
    typeof entry.elementSymbol !== "string"
  ) {
    throw new Error(`${filePath}: ${entry.symbol} has an invalid elementSymbol`);
  }

  if (!Number.isInteger(entry.grade) || entry.grade < 1 || entry.grade > 5) {
    throw new Error(`${filePath}: ${entry.symbol} has an invalid grade`);
  }

  if (typeof entry.line !== "string" || entry.line.length === 0) {
    throw new Error(`${filePath}: ${entry.symbol} has an invalid line`);
  }

  return {
    key: entry.symbol.toLowerCase(),
    value: {
      name: entry.name,
      type,
      elementSymbol: entry.elementSymbol,
      grade: entry.grade,
      line: entry.line,
    },
  };
}

async function loadCatalogue(type, filePath) {
  const resolvedPath = resolve(filePath);
  const text = await readFile(resolvedPath, "utf8");
  const parsed = parseJsonc(text, resolvedPath);

  if (!Array.isArray(parsed)) {
    throw new Error(`${resolvedPath}: catalogue root must be an array`);
  }

  return parsed.map((entry, index) =>
    validateEntry(entry, type, index, resolvedPath),
  );
}

async function main() {
  const options = readArguments(process.argv.slice(2));
  const catalogues = await Promise.all(
    MATERIAL_TYPES.map((type) => loadCatalogue(type, options[type])),
  );

  const entries = new Map();
  const counts = {};

  for (let typeIndex = 0; typeIndex < MATERIAL_TYPES.length; typeIndex += 1) {
    const type = MATERIAL_TYPES[typeIndex];
    const catalogue = catalogues[typeIndex];
    counts[type] = catalogue.length;

    for (const { key, value } of catalogue) {
      if (entries.has(key)) {
        throw new Error(`Duplicate material symbol after normalisation: ${key}`);
      }
      entries.set(key, value);
    }
  }

  const sortedEntries = [...entries.entries()].sort(([left], [right]) =>
    left.localeCompare(right),
  );
  const outputPath = resolve(options.output);
  const serialisedEntries = sortedEntries
    .map(
      ([symbol, entry]) => `  ${JSON.stringify(symbol)}: {
    name: ${JSON.stringify(entry.name)},
    type: ${JSON.stringify(entry.type)},
    elementSymbol: ${JSON.stringify(entry.elementSymbol)},
    grade: ${entry.grade},
    line: ${JSON.stringify(entry.line)},
  }`,
    )
    .join(",\n");
  const typescriptModule = `export type MaterialType =
  | "raw"
  | "manufactured"
  | "encoded";

export type MaterialGrade = 1 | 2 | 3 | 4 | 5;

export type MaterialEntry = {
  name: string;
  type: MaterialType;
  elementSymbol: string | null;
  grade: MaterialGrade;
  line: string;
};

export const MATERIALS_BY_SYMBOL = {
${serialisedEntries},
} as const satisfies Record<string, MaterialEntry>;

export type MaterialSymbol = keyof typeof MATERIALS_BY_SYMBOL;
`;

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, typescriptModule, "utf8");

  console.log(
    `Wrote ${entries.size} materials to ${outputPath} ` +
      `(${counts.raw} raw, ${counts.manufactured} manufactured, ` +
      `${counts.encoded} encoded).`,
  );
}

main().catch((error) => {
  printUsage();
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
