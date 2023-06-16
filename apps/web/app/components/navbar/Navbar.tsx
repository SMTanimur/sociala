'use client';
import { Popover } from '@headlessui/react';
import {
  BellIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { UnauthorizedHeader } from './UnauthorizedHeader';
import { useState } from 'react';
import { GradientBar, Heading, Spinner, cn } from '~ui';
import Search from './Search';
import SwitchTheme from './SwitchTheme';
import { ProfileDropdown } from './ProfileDropdown';
import Link from 'next/link';
import { useAuth, useProfileQuery } from '@social-zone/client';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const [openNotifications, setNotificationOpen] = useState<boolean>(false);
  const [openUserNotifications, setUserNotificationOpen] =
    useState<boolean>(false);
  const { data } = useProfileQuery();
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return (
      <>
        <UnauthorizedHeader />
      </>
    );
  }

  return (
    <Popover
      as="header"
      className={({ open, close }) =>
        cn(
          open ? 'fixed inset-0  overflow-y-auto' : '',
          'bg-white dark:bg-gray-900 my-5 md:h-[60px] shadow-sm lg:static lg:overflow-y-visible z-40 '
        )
      }
    >
      {({ open, close }) => (
        <>
          <GradientBar
            color="pink"
            size="sm"
            className="fixed max-w-full top-0 z-10"
          />
          <div className="bg-white/70 dark:bg-gray-900/40 backdrop-blur-md px-4 sm:px-6 lg:px-8 fixed top-0.5 z-10 w-full">
            <div className="mx-auto max-w-7xl relative flex justify-between xl:grid xl:grid-cols-12 lg:gap-8">
              <div className="flex md:absolute md:left-0 md:inset-y-0 lg:static xl:col-span-2">
                <div className="flex-shrink-0 flex items-center">
                  {/* <Logo /> */}
                  <Link href="/">
                    <Heading size="h5" className="gradient-text">
                      UmmahLink
                    </Heading>
                  </Link>
                </div>
              </div>
              <div className="min-w-0 flex-1  lg:px-0 lg:max-w-5xl xl:col-span-6 flex-grow">
                <div className="flex items-center px-6 py-4 md:max-w-5xl md:mx-auto lg:mx-0 xl:px-0">
                  <Search />
                </div>
              </div>
              <div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
                {/* Mobile menu button */}

                <button
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  type="button"
                  className="mx-3 ml-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                <Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500">
                  <span className="sr-only">Open menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Popover.Button>
              </div>
              <div className="hidden  lg:flex lg:items-center lg:justify-end xl:col-span-4 space-x-5">
							<button
                  onClick={() => setUserNotificationOpen((prev) => !prev)}
                  type="button"
                  className="ml-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">View User notifications</span>
                  <UserCircleIcon className="h-8 w-8" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setNotificationOpen((prev) => !prev)}
                  type="button"
                  className="ml-auto flex-shrink-0 bg-white dark:bg-gray-800 rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-8 w-8" aria-hidden="true" />
                </button>
                {!isAuthenticated ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <ProfileDropdown user={data?.me} />
                )}

                {/* <Link href={`/post/new`} className="ml-6 text-sm no-underline">
                  <Button size="lg">New Post</Button>
                </Link> */}
                <SwitchTheme />
              </div>
            </div>
          </div>
          {/* <NotificationOverlay
						open={openNotifications}
						setOpen={setNotificationOpen}
					/> */}
					<MobileMenu user={data?.me} open={open} closeFx={close} />
        </>
      )}
    </Popover>
  );
}
