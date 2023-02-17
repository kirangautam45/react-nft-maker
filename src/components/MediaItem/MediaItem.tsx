import { Fragment, useEffect, useState } from 'react';

import { convertFileUrlToBase64 } from '@/utils/helper';

import { DivVideoElement, DivAudeoElement, DivImageElement } from './MediaItem.styles';

const MediaItem = ({ file, src }: { file?: File | undefined; src?: string | undefined }) => {
  const [data, setData] = useState<string | undefined | any>();
  useEffect(() => {
    if (src) {
      setData(convertFileUrlToBase64(src));
    }
  }, []);

  return (
    <Fragment>
      {data &&
        (file?.type?.includes('video') ? (
          <DivVideoElement controls src={src} />
        ) : file?.type?.includes('audio') ? (
          <DivAudeoElement controls>
            <source src={src} />
          </DivAudeoElement>
        ) : (
          <DivImageElement alt="uploaded file" src={src} />
        ))}
      {file &&
        !data &&
        (file?.type?.includes('video') ? (
          <DivVideoElement controls src={URL.createObjectURL(file)} />
        ) : file?.type?.includes('audio') ? (
          <DivAudeoElement controls>
            <source src={URL.createObjectURL(file)} />
          </DivAudeoElement>
        ) : (
          <DivImageElement alt="uploaded file" src={URL.createObjectURL(file)} />
        ))}
    </Fragment>
  );
};
export default MediaItem;
