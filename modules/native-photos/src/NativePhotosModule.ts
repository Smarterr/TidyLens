import { NativeModule, requireNativeModule } from 'expo';

import { NativePhotosModuleEvents } from './NativePhotos.types';

declare class NativePhotosModule extends NativeModule<NativePhotosModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<NativePhotosModule>('NativePhotos');
