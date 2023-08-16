"use client"
import type { FC } from 'react';
import { DeleteComment, DeletePost } from '~ui';



export const GlobalAlerts: FC = () => {
 
  return (
    <div>
      <DeletePost />
      <DeleteComment/>
    </div>
  );
};

