'use client';
import UserInfo from '@/components/UserInfo';

export default function UserProfilePage() {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-6'>User Profile</h1>
      <UserInfo />
    </div>
  );
}
