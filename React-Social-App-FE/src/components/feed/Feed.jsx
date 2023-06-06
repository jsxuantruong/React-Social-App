import { CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getDataAPI } from "../../api/fetchData";
import { LOADING_POST_END, UPDATE_INFO_GET_POST } from "../../redux/actions";
import MessagePretty from "../MessagePretty/MessagePretty";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.scss";
import GetMorePost from "./GetMorePost";

export default function Feed({ userName }) {
  const [posts, setPosts] = useState([]);

  const { socket } = useSelector((state) => state.network);
  const { limit, skip, isLoadingPost, isMaxPost } = useSelector(
    (state) => state.post
  );

  const { userCurrent } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleUpdateFeed = ({ post, type, message }) => {
      toast.info(message, { autoClose: 2000 });

      setPosts((prev) =>
        type === "removePost"
          ? prev.filter((postFeed) => postFeed?._id !== post?._id)
          : type === "updatePost"
          ? prev.map((postFeed) =>
              postFeed?._id !== post?._id ? postFeed : post
            )
          : [post, ...prev]
      );
    };

    if (socket) {
      socket.on("updateFeed", handleUpdateFeed);
    }

    return () => {
      socket?.off("updateFeed", handleUpdateFeed);
    };
  }, [socket]);

  useEffect(() => {
    let isMount = true;

    const fetchPosts = async () => {
      try {
        const response = await getDataAPI(
          `/post/get-feed-post?limit=${limit}&skip=${skip}`
        );

        const { posts: newPosts } = response;
        if (!newPosts.length) {
          dispatch({
            type: UPDATE_INFO_GET_POST,
            payload: { isMaxPost: true },
          });
          return;
        }
        if (!isMount) return;
        setPosts([...posts, ...newPosts]);
      } catch (err) {
        console.log("get post feed", err);
      } finally {
        dispatch({
          type: LOADING_POST_END,
        });
      }
    };
    fetchPosts();

    return () => (isMount = false);
  }, [limit, skip]);

  return (
    <div className="feedWrapper">
      {(!userName || userName === userCurrent?.userName) && (
        <Share setPosts={setPosts} />
      )}
      {posts.map((p) => (
        <Post setPosts={setPosts} key={p._id} post={p} />
      ))}

      {isLoadingPost ? (
        <div className="loadingPost">
          <CircularProgress color="primary" />
        </div>
      ) : !isMaxPost ? (
        <GetMorePost postsLength={posts.length} limit={limit} />
      ) : (
        <MessagePretty mess={"Make friends to see more posts"} />
      )}
    </div>
  );
}
