import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './NativePhotos.types';

type NativePhotosModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class NativePhotosModule extends NativeModule<NativePhotosModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(NativePhotosModule, 'NativePhotosModule');
