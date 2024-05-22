/**
 * Generates command to run 'next lint' properly
 * @param {*} filenames
 * @returns command
 */

export default {
  "*": ["tsc", "next lint --fix"],
};
