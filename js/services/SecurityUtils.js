/**
 * Security utilities for the application.
 */
export const SecurityUtils = {
  /**
   * Hashes a string using SHA-256.
   * @param {string} text - The text to hash.
   * @returns {Promise<string>} - The resulting hash as a hex string.
   */
  async hashPassword(text) {
    const msgUint8 = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Escapes HTML characters to prevent XSS.
   * @param {string} str - The string to escape.
   * @returns {string} - The escaped string.
   */
  escapeHTML(str) {
    if (typeof str !== 'string') return str;
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
