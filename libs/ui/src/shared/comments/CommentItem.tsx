'use client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useRef, useState } from 'react';

import CommentInput from './CommentInput';

import {
  CommentPaginate,
  useLikeOrUnlikeCommentMutation,
  useReplyCommentMutation,
  useUpdateCommentMutation,
} from '@social-zone/graphql';
import { useComment, useGetReplyCommentsQuery } from '../../hooks/comment';
import Link from 'next/link';
import { ErrorMessage, Image } from '../../components';
import { UserAvatarUrl } from '../../data';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { errorToast } from '../../lib';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/24/outline';
import LoadingIcon from '../../components/Spinner/LoadingIcon';

dayjs.extend(relativeTime);

interface IProps {
  comment: CommentPaginate;
}

const CommentItem: React.FC<IProps> = (props) => {
  const comment = props.comment;
  const [isOpenInput, setOpenInput] = useState(false);
  const [isVisibleReplies, setVisibleReplies] = useState(true);
  const [editCommentBody, setEditCommentBody] = useState(
    props.comment.body || ''
  );
  const [newCommentBody, setNewCommentBody] = useState('');
  const [isGettingReplies, setGettingReplies] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isUpdateMode, setUpdateMode] = useState(false);
  const onError = (error: any) => {
    errorToast(error);
  };

  const replyInputRef = useRef<HTMLInputElement | null>(null);
  const editCommentInputRef = useRef<HTMLInputElement | null>(null);

  const onClickViewReplies = () => {
    if (isGettingReplies) return;
    setVisibleReplies(!isVisibleReplies);
  };

  const { mutateAsync } = useUpdateCommentMutation();
  const { mutateAsync: ReplyCommentCreate } = useReplyCommentMutation();
  const { mutateAsync: LikeMutate } = useLikeOrUnlikeCommentMutation();
  const queryClient = useQueryClient();

  const handleSubmitReply = async (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      try {
        setSubmitting(true);

        if (isUpdateMode && editCommentBody) {
          mutateAsync(
            {
              input: { commentId: comment.id, body: editCommentBody },
            },
            {
              onSuccess: () => {
                setEditCommentBody('');
                setUpdateMode(false);
                queryClient.invalidateQueries(['comments.infinite']);
                queryClient.invalidateQueries(['commentReplies.infinite']);
              },
            }
          );
        } else {
          ReplyCommentCreate(
            {
              input: {
                _post_id: comment.post_id,
                commentId: comment.id,
                body: newCommentBody,
              },
            },
            {
              onSuccess: () => {
                setNewCommentBody('');
                setOpenInput(false);
                queryClient.invalidateQueries(['comments.infinite']);
                queryClient.invalidateQueries(['commentReplies.infinite']);
              },
            }
          );
        }

        // make sure it's mounted before setting states

        if (isUpdateMode) {
          setEditCommentBody('');
          setUpdateMode(false);
        } else {
          setNewCommentBody('');
          setOpenInput(false);
        }
      } catch (e: any) {
        console.log(e);
      }
    } else if (e.key === 'Escape') {
      // if (isUpdateMode) handleCancelUpdate();
      setUpdateMode(false);
      setOpenInput(false);
      editCommentInputRef.current && editCommentInputRef.current.blur();
      replyInputRef.current && replyInputRef.current.blur();
    }
  };

  const onClickReply = () => {
    setOpenInput(!isOpenInput);
    setUpdateMode(false);
  };

  const handleOnEditReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditCommentBody(e.target.value);
  };

  const handleOnNewReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCommentBody(e.target.value);
  };

  const { data } = useGetReplyCommentsQuery({
    option: { limit: 10 },
    query: { comment_id: comment.id, post_id: comment.post_id },
  });
  const RepliesData =
    data?.pages.flatMap((page) => page.getReplies?.docs) ?? [];
  const onClickEdit = () => {
    setUpdateMode(true);
    setEditCommentBody(comment.body);
    setOpenInput(false);
  };

  const onClickLike = async () => {
    if (isLiking) return;

    try {
      toast.promise(
        LikeMutate({
          input: { comment_id: comment.id, postId: comment.post_id },
        }),
        {
          loading: 'Liking...',
          success: ({ likeOrUnlikeComment: { message } }) => {
            queryClient.invalidateQueries(['comments.infinite']);
            queryClient.invalidateQueries(['commentReplies.infinite']);

            return <b>{message}</b>;
          },
          error: (data) => {
            return (
              <ErrorMessage
                className="mb-3"
                title=" Delete Comment failed!"
                error={{
                  name: ' Delete Comment failed!',
                  message: data.message,
                }}
              />
            );
          },
        }
      );
    } catch (err) {
      onError(err);
    }
  };

  return (
    <div className="flex py-2 items-start w-full" key={comment.id}>
      <Link href={`/user/${comment.author.username}`} className="mr-2">
        <Image
          src={
            comment?.author?.avatar.avatarUrl
              ? comment?.author?.avatar.avatarUrl
              : UserAvatarUrl
          }
          className="h-[50px] w-[50px] cursor-pointer rounded-full bg-gray-200 ring-8 ring-gray-50 dark:bg-gray-700 dark:ring-black sm:h-[60px] sm:w-[60px]"
          height={60}
          width={60}
          alt={comment?.author?.username}
          data-testid="profile-avatar"
        />
      </Link>
      <div className="inline-flex items-start flex-col w-full">
        {isUpdateMode ? (
          <CommentInput
            value={editCommentBody}
            placeholder="Write a reply..."
            onChange={handleOnEditReplyChange}
            isSubmitting={isSubmitting}
            ref={editCommentInputRef}
            isUpdateMode={isUpdateMode}
            onKeyDown={handleSubmitReply}
          />
        ) : (
          <>
            <div className="flex items-start w-full laptop:w-auto">
              {/* ------ USERNAME AND COMMENT TEXT ----- */}
              <div className="bg-gray-100 dark:bg-indigo-950 px-2 py-1 rounded-md flex-grow laptop:flex-grow-0">
                <Link
                  className="inline-block"
                  href={`/user/${comment.author.username}`}
                >
                  <h5 className="dark:text-indigo-400">
                    {comment.author.username}
                  </h5>
                </Link>
                <p className="text-gray-800 text-sm min-w-full break-all dark:text-gray-200 inline-block">
                  {comment.body}
                </p>
              </div>
              {/* {(comment.isOwnComment || comment.isPostOwner) && (
                <CommentOptions
                  comment={comment}
                  onClickEdit={onClickEdit}
                  openDeleteModal={props.openDeleteModal}
                />
              )} */}
            </div>
            <div className="mx-2">
              {/* ---- DATE AND LIKE BUTTON ----- */}
              <div className="mt-1 flex items-center space-x-2">
                {/* ---- LIKE BUTTON ---- */}
                {comment.likesCount > 0 && (
                  <span className="text-sm text-gray-500">
                    {comment.likesCount}
                  </span>
                )}
                <span
                  className={`text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs ${
                    comment.isLiked &&
                    'font-bold text-indigo-500 dark:text-indigo-300'
                  } ${isLiking && 'opacity-50 hover:cursor-default'}`}
                  onClick={onClickLike}
                >
                  {comment.isLiked ? 'Unlike' : 'Like'}
                </span>
                {/* ---- REPLY BUTTON */}
                {comment?.depth < 3 && (
                  <span
                    className="text-gray-400 hover:cursor-pointer hover:text-gray-800 dark:hover:text-gray-200 text-xs"
                    onClick={onClickReply}
                  >
                    Reply
                  </span>
                )}
                {/* ---- DATE ---- */}
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {dayjs(comment.createdAt).fromNow()}
                </span>
                {comment.isEdited && (
                  <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">
                    Edited
                  </span>
                )}
              </div>
              {/* ---- VIEW REPLIES BUTTON ----  */}
              {(comment.replyCount > 0 || RepliesData?.length > 0) && (
                <div className="flex space-x-2">
                  <span
                    className="text-xs text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-200 mt-2 hover:cursor-pointer"
                    onClick={onClickViewReplies}
                  >
                    {isVisibleReplies && RepliesData?.length !== 0
                      ? 'Hide Replies'
                      : 'View Replies'}
                    &nbsp;
                    {isGettingReplies ? (
                      <LoadingIcon className="w-4 h-4" />
                    ) : isVisibleReplies && RepliesData.length !== 0 ? (
                      <ArrowUpIcon className="w-3 h-3" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3" />
                    )}
                  </span>

                  {/* {error && error?.status_code !== 404 && (
                    <span className="text-gray-400 text-xs">
                      {error?.error?.message}
                    </span>
                  )} */}
                </div>
              )}
            </div>
          </>
        )}
        {/* ------ REPLY INPUT ----- */}
        {isOpenInput && !isUpdateMode && (
          <div className="py-4 w-full">
            <CommentInput
              value={newCommentBody}
              placeholder="Write a reply..."
              onChange={handleOnNewReplyChange}
              isSubmitting={isSubmitting}
              ref={replyInputRef}
              isUpdateMode={isUpdateMode}
              onKeyDown={handleSubmitReply}
            />
          </div>
        )}
        {/* ---- REPLY LIST ------- */}
        {/* {RepliesData.length > 0 && isVisibleReplies && (
          <CommentList comments={replies} />
        )} */}
      </div>
    </div>
  );
};

export default CommentItem;