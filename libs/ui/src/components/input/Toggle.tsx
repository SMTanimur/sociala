"use client"
import { Switch } from '@headlessui/react';
import type { Dispatch, FC } from 'react';
import { cn } from '../../lib';




interface ToggleProps {
  on: boolean;
  setOn: Dispatch<boolean>;
}

export const Toggle: FC<ToggleProps> = ({ on, setOn }) => {
  return (
    <Switch
      checked={on}
      onChange={() => {
        setOn(!on);
      }}
      className={cn(
        on ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700',
        'inline-flex h-[22px] w-[42.5px] cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none'
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          on ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-[18px] w-[18px] rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out'
        )}
      />
    </Switch>
  );
};
