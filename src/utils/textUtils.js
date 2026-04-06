/**
 * Formats a string to title case (e.g., "HELLO WORLD" -> "Hello World")
 * @param {string} text - The text to format
 * @returns {string} - The formatted text
 */
export const formatToTitle = (text) => {
  if (!text) return ''
  return text.toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
