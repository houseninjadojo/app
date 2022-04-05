export function getIconUri(type) {
  const PATH = '/assets/icons';
  switch (type) {
    case 'application/pdf':
      return `${PATH}/pdf.svg`;
    case 'image/png':
      return `${PATH}/image.svg`;
    case 'image/jpg':
      return `${PATH}/image.svg`;
    case 'image/heic':
      return `${PATH}/image.svg`;
    case 'zip':
      return `${PATH}/zip.svg`;
    case 'folder':
      return `${PATH}/folder.svg`;
    default:
      return `${PATH}/`;
  }
}
