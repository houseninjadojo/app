export function getIconUri(type) {
  const PATH = '/assets/icons';
  switch (type) {
    case 'application/pdf':
      return `${PATH}/pdf.svg`;
    case 'zip':
      return `${PATH}/zip.svg`;
    case 'folder':
      return `${PATH}/folder.svg`;
    case 'image/webp':
    case 'image/png':
    case 'image/jpg':
    case 'image/heic':
    default:
      return `${PATH}/image.svg`;
  }
}
