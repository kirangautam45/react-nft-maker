import { API_DASHBOARD_DATA, API_NFT } from '@/constants/api';
import { INFTDetails } from '@/store/nft/types';

import { getRequest } from '../utils';

export interface IDashboardData {
  name: string;
  role: string;
  title: string;
}

export interface IServerNftItemType {
  nftId: string;
  categoryId: string;
  created: number;
  filePath: string;
  description: string;
  collectionId: string;
  tags: string[];
  title: string;
}

export const getDashboardData = async (): Promise<IDashboardData[]> => {
  const { data } = await getRequest(API_DASHBOARD_DATA);
  return data;
};

export const getNFTDetails = async (nftId: string): Promise<any> => {
  try {
    const { data } = await getRequest(`${API_NFT}/${nftId}`);
    return transformData(data);
  } catch (e) {
    // TODO: Remove [MOCK DATA] after API integration verification
    return transformData({
      nftId: 'YgXqkf8wketZOVPqOKPZu',
      categoryId: 'XNwyaIOPKkfc1iFngXorm',
      created: 1646248032476,
      filePath:
        'https://cdn.eathappyproject.com/wp-content/uploads/2021/02/The-Most-Beautiful-Flowers-in-the-World-With-Name-and-Picture.jpg',
      description: 'this is my favorite art!',
      collectionId: '_0iM8scD5fkKFi6l9tMo0',
      tags: ['rare', 'fun'],
      title: 'lonely stars',
    });
  }
};

const transformData = (serverData: IServerNftItemType): INFTDetails => {
  const { nftId, title, description, created, filePath, categoryId } = serverData;
  return {
    data: {
      nftId,
      title,
      description,
      category: categoryId,
      actionType: '',
      created,
      updated: created,
      fileUrl: filePath,
      status: '',
      attributes: [],
      ownerId: '',
      owner: {
        created,
        email: '',
        status: '',
        fullName: '',
        userId: '',
        verified: true,
        walletStatus: '',
        walletId: '',
      },
    },
    message: '',
    error: '',
    status: '',
    currentStep: null,
  };
};
