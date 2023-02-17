import { screen, render } from '@testing-library/react';

import CreateNFT from './CreateNFT';

const props = {
  open: true,
};

describe('Single NFT', () => {
  it('should render Create NFT Modal', () => {
    render(<CreateNFT {...props} />);

    const createNFTTitle = screen.getByText(/Create NFT/);
    expect(createNFTTitle).toBeInTheDocument();

    const createNFTButton = screen.getByText(/Create an Nft/);
    expect(createNFTButton).toBeInTheDocument();
  });
});
