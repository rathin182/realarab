import type { BuyerHomeData } from '@/types/home';
import { dummyBuyerHome } from '@/data/dummyBuyerHome';
export async function getBuyerHome(): Promise<BuyerHomeData> {
  await new Promise((r) => setTimeout(r, 600)); 
  return dummyBuyerHome;
}
