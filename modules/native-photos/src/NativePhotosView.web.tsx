import * as React from 'react';

import { NativePhotosViewProps } from './NativePhotos.types';

export default function NativePhotosView(props: NativePhotosViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
