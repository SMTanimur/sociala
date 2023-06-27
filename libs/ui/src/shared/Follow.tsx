/* eslint-disable @nx/enforce-module-boundaries */
import { ProfileInformation, useMeQuery } from "@social-zone/graphql";
import { Dispatch, FC} from "react";
import { useGlobalModalStateStore } from "../store";
import { useFollowOrUnFollow } from "@social-zone/client";
import { Button, Spinner } from "../components";
import { UserPlusIcon } from "@heroicons/react/24/outline";



interface FollowProps {
  profile: ProfileInformation
  setFollowing: Dispatch<boolean>;
  showText?: boolean;
  outline?: boolean;
}

export const Follow: FC<FollowProps> = ({
  profile,
  showText = false,
  setFollowing,
  outline = true
}) => {

  const {data}=useMeQuery()
  const {FollowLoading,attemptToFollow} =useFollowOrUnFollow()
 
  const setShowAuthModal = useGlobalModalStateStore(
    (state) => state.setLoginModal
  );
 
  const createFollow = async () => {
    if (!data?.me) {
      setShowAuthModal(true);
      return;
    }
    await  attemptToFollow(profile.id).then(()=>{
      setFollowing(true)
    })
  };

  return (
    <Button
      className="!px-3 !py-1.5 text-sm"
      outline={outline}
      onClick={createFollow}
      aria-label="Follow"
      disabled={FollowLoading}
      icon={
        FollowLoading ? <Spinner size="xs" /> : <UserPlusIcon className="h-4 w-4" />
      }
    >
      {showText && `Follow`}
    </Button>
  );
};

