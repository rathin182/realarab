import type { Metadata } from 'next';
import { ProfileView } from '../../../components/user/ProfileView';

export const metadata: Metadata = {
  title: 'My Profile - Najm Estates KSA',
};

export default function BuyerProfilePage() {
  return <ProfileView />;
}