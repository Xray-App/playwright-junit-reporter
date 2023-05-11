type FileExtension = 'image/png' | 'text/plain' | 'video/webm' | 'application/zip';

class ContentTypeMapper{

  getFileExtenion(contentType: FileExtension): string {
    switch (contentType) {
      case 'image/png':
        return '.png';
      case 'text/plain':
        return '.txt';
      case 'video/webm':
        return '.webm';
      case 'application/zip':
        return '.zip';
      default:
        throw new console.warn(`could not map filetype of: ${contentType} to a correct ending`);
    }
  }
}

export default new ContentTypeMapper();
