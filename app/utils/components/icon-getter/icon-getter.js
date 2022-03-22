export function getIconUri(type) {
  const PATH = '/assets/icons';
  switch (type) {
    case 'group':
      return `${PATH}/folder.svg`;
    case 'pdf':
      return `${PATH}/pdf.svg`;
    case 'png':
      return `${PATH}/image.svg`;
    case 'jpg':
      return `${PATH}/image.svg`;
    case 'heic':
      return `${PATH}/image.svg`;
    case 'zip':
      return `${PATH}/zip.svg`;
    default:
      return `${PATH}/`;
  }
}
