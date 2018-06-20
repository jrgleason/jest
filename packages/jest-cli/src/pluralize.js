export default function pluralize(word, count, ending) {
  return `${count} ${word}${count === 1 ? '' : ending}`;
}
