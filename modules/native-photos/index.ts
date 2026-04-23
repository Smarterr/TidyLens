// modules/native-photos/index.ts
import NativePhotosModule from './src/NativePhotosModule';

export async function getPhotos(includeICloud: boolean): Promise<any[]> {
  return await NativePhotosModule.getPhotos(includeICloud);
}