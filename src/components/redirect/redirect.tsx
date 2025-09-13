'use client';

import { useFirstActiveRoute, useNavigate } from '@/hooks';
import route from '@/routes';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function Redirect() {
  const pathname = usePathname();
  const navigate = useNavigate(false);
  const firstActiveRoute = useFirstActiveRoute();

  useEffect(() => {
    if (pathname === route.home.path) {
      navigate(firstActiveRoute);
    }
  }, [pathname, firstActiveRoute, navigate]);

  return null;
}
