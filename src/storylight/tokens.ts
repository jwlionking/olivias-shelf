export type StoryToken = {
  text: string;
  raw: string;
  key?: string;
  action?: string;
  punct: boolean;
};

const TOKEN = /\{([^{}]+)\}|([^{]+)/g;

export function parseStory(text: string): StoryToken[] {
  const out: StoryToken[] = [];
  let m: RegExpExecArray | null;
  const re = new RegExp(TOKEN.source, "g");
  while ((m = re.exec(text))) {
    if (m[1]) {
      const [label, action] = m[1].split(":");
      const display = label.replace(/_/g, " ");
      out.push({
        text: display,
        raw: m[1],
        key: display.toLowerCase(),
        action,
        punct: false,
      });
    } else if (m[2]) {
      out.push({
        text: m[2],
        raw: m[2],
        punct: true,
      });
    }
  }
  return out;
}

export function plainText(text: string) {
  return parseStory(text)
    .map((t) => t.text)
    .join("");
}

export function wordSpans(text: string) {
  const tokens = parseStory(text);
  const words: { word: string; start: number; token: StoryToken }[] = [];
  let i = 0;
  for (const token of tokens) {
    if (token.punct) {
      i += token.text.length;
      continue;
    }
    words.push({ word: token.text, start: i, token });
    i += token.text.length;
  }
  return { tokens, words, plain: plainText(text) };
}
