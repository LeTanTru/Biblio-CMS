'use client';

import { AvatarField } from '@/components/form';
import List from '@/components/list';
import ListItem from '@/components/list/ListItem';
import { storageKeys } from '@/constants';
import { useNavigate, useQueryParams } from '@/hooks';
import { logger } from '@/logger';
import { useLogoutMutation } from '@/queries';
import route from '@/routes';
import { useAuthStore } from '@/store';
import { getData, notify, removeData, renderImageUrl, setData } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CircleUserRound, LogOut, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DropdownAvatar() {
  const navigate = useNavigate();
  const { profile, setLoading, setAuthenticated, setProfile } = useAuthStore();
  const [open, setOpen] = useState(false);
  const logoutMutation = useLogoutMutation();
  const pathname = usePathname();
  const { queryString } = useQueryParams();

  const handleLogout = async () => {
    setLoading(true);
    await logoutMutation.mutateAsync(undefined, {
      onSuccess: (res) => {
        if (res.result) {
          removeData(storageKeys.ACCESS_TOKEN);
          notify.success('Đăng xuất thành công');
          setAuthenticated(false);
          setProfile(null);
          navigate(route.login.path);
        } else {
          notify.error('Đăng xuất thất bại');
        }
      },
      onError: (error) => {
        logger.error('Error while logging out: ', error);
        notify.error('Đăng xuất thất bại');
      },
      onSettled: () => {
        setLoading(false);
      }
    });
  };

  const handleProfileClick = () => {
    if (getData(storageKeys.PREVIOUS_PATH) === pathname) {
      setOpen(false);
      return;
    }
    setData(
      storageKeys.PREVIOUS_PATH,
      queryString ? `${pathname}?${queryString}` : pathname
    );
    navigate(route.profile.savePage.path);
  };

  return (
    <div
      className='relative z-1 flex items-center gap-4'
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className='flex cursor-pointer items-center gap-2'>
        <span className='text-sm'>{profile?.fullName}</span>
        <AvatarField
          src={renderImageUrl(profile?.avatarPath)}
          disablePreview
          size={40}
          icon={
            <CircleUserRound className='size-8 fill-transparent stroke-gray-600 stroke-2' />
          }
          className='rounded-full'
        />
        <ChevronDown className='size-5' />
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.5, transformOrigin: '75% -20%' }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.1, ease: 'linear' }}
            className='absolute top-full right-0 mt-4 w-45 rounded-md bg-white shadow-[0px_0px_10px_6px] shadow-gray-200'
          >
            <div className='z-2 before:absolute before:-top-4 before:left-0 before:h-4 before:w-full before:bg-transparent'></div>
            <div className='absolute -top-2 right-9 border-r-8 border-b-8 border-l-8 border-r-transparent border-b-white border-l-transparent'></div>
            <List className='flex flex-col gap-y-2 p-1'>
              <ListItem
                onClick={() => handleProfileClick()}
                className='flex w-full cursor-pointer items-center gap-2 rounded-md bg-transparent px-2 py-2 text-sm font-normal text-black transition-all duration-200 ease-linear hover:bg-gray-100'
              >
                <User className='size-5' /> Hồ sơ
              </ListItem>
              <ListItem
                className='flex w-full cursor-pointer items-center gap-2 rounded-md bg-transparent px-2 py-2 text-sm font-normal text-black transition-all duration-200 ease-linear hover:bg-gray-100'
                onClick={handleLogout}
              >
                <LogOut className='size-5' /> Đăng xuất
              </ListItem>
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
