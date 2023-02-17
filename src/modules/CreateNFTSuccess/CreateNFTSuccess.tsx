import { useRouter } from 'next/router';

import image from '@/assets/png/illustration.png';
import CommonDialog from '@/components/core/CommonDialog';
import MediaItem from '@/components/MediaItem';
import { COLORS } from '@/constants/colors';
import { useAppSelector } from '@/hooks/useReduxTypedHooks';
import {
  ButtonOpen,
  DivContainer,
  NftID,
  NftTitle,
  NftTitleMessage,
} from '@/modules/CreateNFTSuccess/CreateNFTSuccess.styles';
import { getNftSelector } from '@/store/nft';

interface IProps {
  handleClose: () => void;
}

const CreateNFTSuccess = (props: IProps) => {
  const router = useRouter();
  const { handleClose } = props;
  const {
    data: { title, nftId, fileUrl },
  } = useAppSelector(getNftSelector);

  const handleOpenDetails = () => {
    router.push(`/nft/${nftId}`);
  };

  return (
    <CommonDialog open title={''} onClose={handleClose}>
      <DivContainer>
        <MediaItem src={fileUrl || image.src} />
        <NftTitle>{title}</NftTitle>
        <NftTitleMessage>Successfully Minted</NftTitleMessage>
        <NftID>{`NFT ID #${nftId}`}</NftID>
        <ButtonOpen onClick={handleOpenDetails} backgroundColor={COLORS.THEME_BUTTON} hoverColor={COLORS.THEME_BUTTON}>
          Open
        </ButtonOpen>
      </DivContainer>
    </CommonDialog>
  );
};

export default CreateNFTSuccess;
