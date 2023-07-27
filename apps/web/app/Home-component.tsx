'use client';

import { NextPage } from 'next';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import {
  Button,
  Card,
  Footer,
  GridItemEight,
  GridItemFour,
  GridLayout,
  NewPost,
  PostItem,
  PostsShimmer,
  useAuth,
  useInfiniteFeeds,
  useProfileQuery,
  useUserProfile,
} from '~ui';
import FeedType, { Type } from './components/FeedType';
import RecommendedProfiles from './components/RecommendedProfiles';
import useInfiniteScroll from 'react-infinite-scroll-hook';
import EnableMessages from './components/EnableMessages';
import WithoutUser from './home/WithoutUser';
import Followers from './(subpages)/user/[username]/components/Followers';
import { ProfileInformation } from '@social-zone/graphql';
import Following from './(subpages)/user/[username]/components/Following';

const Home: NextPage = () => {
  const { isAuthenticated } = useAuth();
  const [feedType, setFeedType] = useState<Type>(Type.FEED);
  const { data: me } = useProfileQuery();
  const { data } = useUserProfile(me?.me.username as string);

  const {
    data: feed,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteFeeds(
    {
      option: { limit: 2 },
      query: {},
    },
    {
      // Infinite query
      getNextPageParam: (lastPage) => {
        return lastPage?.getFeeds?.nextPage;
      },
    }
  );

 
 
  const FeedData = feed?.pages.flatMap((page) => page.getFeeds?.docs) ?? [];
  // const { Feed, hasMore, isLoadingMore, loadMore, isFetching, isError } =
  //   useFeedQuery();

  // const [sentryRef] = useInfiniteScroll({
  //   loading: isLoading,
  //   hasNextPage: hasNextPage ?? false,
  //   onLoadMore: ()=>fetchNextPage(),
  //   disabled: isError,
  //   rootMargin: '0px 0px 400px 0px',
  // });


  
  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasNextPage) {
        return;
      }
      fetchNextPage()

    }
    
  });

  if (isLoading) {
    return <PostsShimmer />;
  }

  if (!isAuthenticated) return <WithoutUser />;
  return (
    <div className="relative">
      {/* {!isAuthenticated && <Hero />} */}
      <GridLayout>
        <GridItemEight className="space-y-5  ">
          {isAuthenticated && (
            <>
              <NewPost />
              <FeedType feedType={feedType} setFeedType={setFeedType} />
              {/* ---- NEWS FEED ---- */}

              <Card className="divide-y-[1px] dark:divide-gray-700">
                {feedType === Type.FOLLOWERS ? (
                  <Followers profile={data?.user as ProfileInformation} />
                ) : feedType === Type.FOLLOWING ? (
                  <Following profile={data?.user as ProfileInformation} />
                ) : (
                  <>
                    {FeedData?.map(
                      (post: any, index) =>
                        post?.author && ( // avoid render posts with null author
                          <PostItem
                            key={index}
                            post={post!}
                            isAuth={isAuthenticated}
                          />
                        )
                    )}

                    {hasNextPage && (
                      <Button
                      ref={observe}
                        className="h-11 text-sm font-semibold md:text-base items-center "
                      >
                        Loading More
                      </Button>
                    )}
                  </>
                )}
              </Card>
            </>
          )}
        </GridItemEight>
        <GridItemFour className="space-y-5">
          <div className="sticky text-sm leading-7 top-20">
            {isAuthenticated ? (
              <>
                <EnableMessages />
                <RecommendedProfiles />
              </>
            ) : null}
            <Footer />
          </div>
        </GridItemFour>
      </GridLayout>
    </div>
  );
};

export default Home;
