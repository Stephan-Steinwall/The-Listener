import { marked } from "marked";

// Configure marked for safe inline rendering
marked.setOptions({
  breaks: true,   // Convert \n to <br>
  gfm: true,      // GitHub Flavored Markdown
});

/**
 * Renders a markdown string to sanitized HTML.
 * Uses a simple manual sanitization approach compatible with server-side Next.js.
 * @param {string} text - Raw markdown text
 * @returns {string} - Safe HTML string
 */
export function renderMarkdown(text) {
  if (!text) return "";
  try {
    const html = marked.parse(text);
    // Basic sanitization: remove script tags and dangerous attributes
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/javascript:/gi, "");
  } catch {
    // Fallback to plain text
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}
