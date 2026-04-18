import { requireNativeView } from 'expo';
import * as React from 'react';

import { NativePhotosViewProps } from './NativePhotos.types';

const NativeView: React.ComponentType<NativePhotosViewProps> =
  requireNativeView('NativePhotos');

export default function NativePhotosView(props: NativePhotosViewProps) {
  return <NativeView {...props} />;
}
