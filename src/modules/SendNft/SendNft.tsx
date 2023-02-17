import { ArrowRight } from '@/assets/svg/arrow-right';
import { NoNFTsIcon } from '@/assets/svg/NoNFTsIcon';
import Card from '@/components/Card';
import CommonDialog from '@/components/core/CommonDialog';
import { useAppDispatch, useAppSelector } from '@/hooks/useReduxTypedHooks';
import { closeSendNftDialog, openAndCloseContactDialog } from '@/store/dialogs';
import { getNftSelector, setAllNfts } from '@/store/nft';
import { selectNFT } from '@/utils/helper';

import { DivNoNFTs } from '../NftList/NftList.styles';
import { ButtonSend, DivButtonWrapper, DivHorizontalScroll, DivSendNftSubTitle } from './SendNft.styles';

interface IProps {
  handleClose: () => void;
}

const SendNft = (props: IProps) => {
  const { handleClose } = props;

  const { allNfts = [] } = useAppSelector(getNftSelector);

  const isSelected = !allNfts.find((item) => item.isSelected === true);

  const dispatch = useAppDispatch();

  const handleSelectCard = (selectedNftId: string, isChecked: boolean) => {
    const updatedAllNfts = selectNFT(allNfts, selectedNftId, isChecked);

    dispatch(setAllNfts(updatedAllNfts));
  };

  return (
    <CommonDialog
      open
      onClose={handleClose}
      title={'Send NFT'}
      maxWidth="sm"
      crossIconPosition={{
        top: '14px;',
        right: '0px',
      }}
    >
      <DivSendNftSubTitle>Select an NFT you want to send</DivSendNftSubTitle>
      <DivHorizontalScroll>
        {allNfts && allNfts.length ? (
          allNfts.map((item) => (
            <div key={item.id}>
              <Card
                enableRadiobutton={true}
                data={item}
                isChecked={item.isSelected}
                disableActionIcon={true}
                onDelete={() => {}}
                onMoveUp={() => {}}
                onDownUp={() => {}}
                onSelect={handleSelectCard}
              />
            </div>
          ))
        ) : (
          <DivNoNFTs>
            <NoNFTsIcon />
          </DivNoNFTs>
        )}
      </DivHorizontalScroll>
      <DivButtonWrapper>
        <ButtonSend
          disabled={isSelected}
          onClick={() => {
            dispatch(openAndCloseContactDialog(true));
            dispatch(closeSendNftDialog());
          }}
        >
          Next <ArrowRight />
        </ButtonSend>
      </DivButtonWrapper>
    </CommonDialog>
  );
};

export default SendNft;
