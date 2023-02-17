import * as React from 'react';

import { Breakpoint, Dialog, DialogContent } from '@mui/material';

import { CloseButton } from '@/assets/svg/CloseButton';

import { DialogTitleStyled, DivBackButtonWrapper, DivButtonWrapper, DivTitleStyle } from './CommonDialog.styles';
import { AlignTitleType } from './CommonDialog.types';

export interface IDialogProps {
  open: boolean;
  onClose?: () => void;
  onBack?: () => void;
  disableBack?: boolean;
  title: string;
  children: any;
  alignTitle?: AlignTitleType;
  maxWidth?: false | Breakpoint;
  className?: string;
  paperStyle?: any;
  crossIconPosition?: {
    top: string;
    right: string;
  };
  showClose?: boolean;
}

const CommonDialog: React.FC<React.PropsWithChildren<IDialogProps>> = (props) => {
  const {
    onClose,
    onBack,
    disableBack,
    open,
    title,
    children,
    alignTitle,
    maxWidth,
    className,
    paperStyle,
    crossIconPosition,
    showClose = true,
  } = props;
  return (
    <Dialog
      className={className}
      data-testid="common-dialog-component"
      onClose={onClose}
      open={open}
      keepMounted
      fullWidth
      maxWidth={maxWidth || 'xs'}
      PaperProps={{
        style: { overflowX: 'hidden', borderRadius: 8, padding: 20, ...paperStyle },
      }}
    >
      <DialogTitleStyled>
        <DivTitleStyle alignTitle={alignTitle}>
          {onBack && !disableBack && (
            <DivBackButtonWrapper onClick={onBack} data-testid="back-button">
              Back
            </DivBackButtonWrapper>
          )}
          {title}
          {showClose && (
            <DivButtonWrapper position={crossIconPosition} onClick={onClose} data-testid="close-button">
              <CloseButton />
            </DivButtonWrapper>
          )}
        </DivTitleStyle>
      </DialogTitleStyled>
      <DialogContent style={{ overflowX: 'hidden', marginRight: -40, paddingRight: 50 }}>
        {/* <div className="scroll-prevent"> */}
        {/* {children} */}
        {children}
        {/* </div> */}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialog;
