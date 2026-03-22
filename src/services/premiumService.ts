// Premium service stub
export interface PremiumUser {
  id: string;
  email: string;
  isPremium: boolean;
  syncEnabled: boolean;
}

export const checkPremiumStatus = async (): Promise<boolean> => {
  // TODO: Implement Firebase check
  return false;
};

export const upgradeToPremium = async (): Promise<void> => {
  // TODO: Implement payment flow
};
