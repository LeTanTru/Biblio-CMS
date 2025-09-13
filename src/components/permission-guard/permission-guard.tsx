'use client';

import { Unauthorized } from '@/components/unauthorized';
import route from '@/routes';
import { useAuth } from '@/hooks';
import { usePathname } from 'next/navigation';
import { validatePermission } from '@/utils';
import { useEffect, useState } from 'react';

export default function PermissionGuard({
  children
}: {
  children: React.ReactNode;
}) {
  const {
    loading,
    permissionCode: userPermissions,
    isAuthenticated
  } = useAuth();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  function pathToRegex(path: string): RegExp {
    const regexString = path.replace(/:[^/]+/g, '[^/]+').replace(/\//g, '\\/');
    return new RegExp(`^${regexString}$`);
  }

  function findRouteByPath(obj: Record<string, any>, pathname: string): any {
    for (const key in obj) {
      const item = obj[key];

      if (item?.path) {
        const regex = pathToRegex(item.path);
        if (regex.test(pathname)) {
          return item;
        }
      }

      if (item?.children) {
        const result = findRouteByPath(item.children, pathname);
        if (result) return result;
      }

      if (typeof item === 'object') {
        const result = findRouteByPath(item, pathname);
        if (result) return result;
      }
    }
    return null;
  }

  useEffect(() => {
    if (!loading) {
      setReady(true);
    }
  }, [loading]);

  const matchedRoute = findRouteByPath(route, pathname);

  if (matchedRoute?.auth === false) {
    return <>{children}</>;
  }

  if (!isAuthenticated && ready) {
    return <Unauthorized />;
  }

  const requiredPermissions = matchedRoute?.permissionCode ?? [];

  const hasPermission =
    requiredPermissions.length === 0 ||
    validatePermission({ requiredPermissions, userPermissions });

  if (!hasPermission && ready) {
    return <Unauthorized />;
  }

  return <>{children}</>;
}
