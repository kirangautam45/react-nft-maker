import { API_NFT } from '@/constants/api';

import { postRequest } from '../utils';

export interface Attribute {
  attr_name: string;
  attr_value: string;
}

export interface CreateNFTData {
  title: string;
  description: string;
  // attributes: Attribute[];
  collectionId?: string;
  filePath?: string;
  categoryId?: string;
  tags?: string[];
}

type ICreateNftServiceProps = {
  body: CreateNFTData;
  token: string;
  walletId: string;
};

const transformCreateNftResponse = (response: any) => ({
  ...response,
  data: {
    title: response.data.title,
    category: response.data.categoryId,
    description: response.data.description,
    fileUrl: response.data.filePath,
    nftId: response.data.nftId,
  },
});

export const createNftService = async ({ body, token }: ICreateNftServiceProps): Promise<any> => {
  try {
    const resp = await postRequest(`${API_NFT}`, body, {
      headers: {
        Authorization: token,
      },
    });

    return transformCreateNftResponse(resp.data);
  } catch (e) {
    // TODO: Remove mock response once the API integration is tested successfully
    return transformCreateNftResponse({
      message: 'NFT created successfully.',
      data: {
        title: 'lonely stars',
        description: 'this is my favorite art!',
        collectionId: 'na',
        categoryId: 'na',
        filePath:
          'https://cdn.eathappyproject.com/wp-content/uploads/2021/02/The-Most-Beautiful-Flowers-in-the-World-With-Name-and-Picture.jpg',
        tags: ['rare', 'fun'],
        nftId: 'YgXqkf8wketZOVPqOKPZu',
      },
    });
  }
};
