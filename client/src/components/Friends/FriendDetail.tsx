import { useLocation, useParams } from "react-router-dom";
import { UserPosts } from "../Posts/UserPosts";

export const FriendDetail = () => {
  const { id } = useParams();
  if (!id) return <></>
  const { state } = useLocation();

  return (
    <UserPosts />
  );
};
