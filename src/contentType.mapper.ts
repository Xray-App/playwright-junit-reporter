class ContentTypeMapper{
  getFileExtenion(contentType: string) {
    switch (contentType) {
      case 'image/png':
        return '.png';
      case 'text/plain':
        return '.txt';
      case 'video/webm':
        return '.webm';
      case 'application/zip':
        return '.zip';
    }
  }
}

export default new ContentTypeMapper();
