import NativePhotosModule from './src/NativePhotosModule';

// This exports a clean JavaScript function that secretly triggers our Swift code
export async function getPhotos(includeICloud: boolean): Promise<any[]> {
  return await NativePhotosModule.getPhotos(includeICloud);
}