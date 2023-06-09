
"use client"
import { ComponentProps, ReactNode, useState } from 'react';
import { forwardRef, useId } from 'react';
import { FieldError } from '../form/Form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import { cn } from '~ui';
const HelpTooltip = dynamic(() => import('../helpToolTip/HelpTooltip'));
interface InputProps extends Omit<ComponentProps<'input'>, 'prefix'> {
  label?: string;
  prefix?: string | ReactNode;
  className?: string;
  helper?: ReactNode;
  error?: boolean;
}

export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    prefix,
    type = 'text',
    error,
    className = '',
    helper,
    ...props
  },
  ref
) {

  const [show, setShow] = useState(false);
  const id = useId();

  const iconStyles = [
    'text-zinc-500 [&>*]:peer-focus:text-brand [&>*]:h-5',
    { '!text-red-500 [&>*]:peer-focus:!text-red-500': error },
  ];

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="mb-1 flex items-center space-x-1.5">
          <div className="font-medium text-gray-800 dark:text-gray-200">
            {label}
          </div>
          <HelpTooltip content={helper} />
        </div>
      )}
      <div className="flex">
        {prefix && (
          <span className="lt-text-gray-500 inline-flex items-center rounded-l-xl border border-r-0 border-gray-300 bg-gray-100 px-3 dark:border-gray-700 dark:bg-gray-900">
            {prefix}
          </span>
        )}
        <div
          className={cn(
            { 'bg-gray-500/20 opacity-60': props.disabled },
            error ? '!border-red-500' : 'focus-within:ring-1',
            prefix ? 'rounded-r-xl' : 'rounded-xl',
            'focus-within:border-brand-500 focus-within:ring-brand-400 flex w-full items-center border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900'
          )}
        >
          <input
            id={id}
            className={cn(
              { 'placeholder:text-red-500': error },
              prefix ? 'rounded-r-xl' : 'rounded-xl',
              'peer w-full border-none bg-transparent outline-none focus:ring-0',
              className
            )}

            type={show ? 'text' : 'password'}
            ref={ref}
            {...props}
          />
         
          <span
            tabIndex={-1}
            className={cn('order-last pr-3', iconStyles)}
            onClick={() => setShow((prev) => !prev)}
          >
            {show ? (
              <EyeSlashIcon className="w-6 h-6" />
            ) : (
              <EyeIcon className="w-6 h-6" />
            )}
          </span>
        </div>
      </div>
      {props.name && <FieldError name={props.name} />}
    </label>
  );
});