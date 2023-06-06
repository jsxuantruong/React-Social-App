import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as timeago from "timeago.js";
import { v4 as uuidv4 } from "uuid";
import {
  deleteDataAPI,
  getDataAPI,
  postDataAPI,
  putDataAPI,
} from "../../api/fetchData";
import { debounce } from "../../helpers/debounceFunction";
import { imageUpload } from "../../helpers/image";
import { UPDATE_ID_COMMENT } from "../../redux/actions";
import Avatar from "../avatar/Avatar";
import Comment from "../comment/Comment";
import CreateComment from "../form/createComment/CreateComment";
import ModalConfirmDelete from "../modal/ModalConfirmDelete";
import ModalEditPost from "../modal/ModalEditPost";
import CrudPost from "./CrudPost";
import "./post.scss";
export default function Post({ post, setPosts, className }) {
  const [like, setLike] = useState(post?.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [isShowComment, setIsShowComment] = useState(false);
  const [isCrudPost, setIsCrudPost] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [files, setFiles] = useState([]);

  const { socket } = useSelector((state) => state.network);
  const { userCurrent } = useSelector((state) => state.auth);
  const { idComment, idPostOpen } = useSelector((state) => state.comment);

  const idCreateComment = useRef(uuidv4());
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCheckClick = (e) => {
      if (isCrudPost) {
        setIsCrudPost(false);
      }
    };

    document.body.addEventListener("click", handleCheckClick);

    return () => document.body.removeEventListener("click", handleCheckClick);
  }, [isCrudPost]);

  useEffect(() => {
    setIsLiked(post?.likes.includes(userCurrent?._id));
    setLike(post?.likes.length);
  }, [post?.likes, userCurrent?._id]);

  useEffect(() => {
    let isMount = true;
    const getComments = async () => {
      try {
        const response = await getDataAPI(`/post/get-all-comment/${post?._id}`);

        const { comments } = response;

        if (isMount) setComments(comments);
      } catch (err) {
        console.log("err", err);
      }
    };

    if (isShowComment) getComments();

    return () => (isMount = false);
  }, [isShowComment, post?.comments]);

  useEffect(() => {
    let isMount = true;

    if (userCurrent?._id !== post?.userId) {
      const fetchUser = async () => {
        try {
          const response = await getDataAPI(`/user?userId=${post?.userId}`);

          const { user } = response;
          setUser(user);
        } catch (err) {
          console.log("err", err);
        }
      };
      fetchUser();
    } else {
      if (isMount) setUser(userCurrent);
    }

    return () => (isMount = false);
  }, [userCurrent, post?.userId]);

  useEffect(() => {
    const handleUpdateLikePost = ({ type, message, postId }) => {
      if (post?._id !== postId) return;

      setLike((prev) => (type === "like" ? prev + 1 : prev - 1));
    };

    const handleUpdateCmtPost = ({ postId, type, comment }) => {
      if (post?._id !== postId) return;

      setComments((prev) =>
        type === "remove"
          ? prev.filter((commentPost) => commentPost?._id !== comment?._id)
          : type === "update"
          ? prev.map((commentPost) =>
              commentPost?._id !== comment?._id ? commentPost : comment
            )
          : [comment, ...prev]
      );
    };

    if (socket) {
      socket.on("updateLikePost", handleUpdateLikePost);
      socket.on("updateCommentPost", handleUpdateCmtPost);
    }

    return () => {
      socket?.off("getNotify", handleUpdateLikePost);
      socket?.off("updateCommentPost", handleUpdateCmtPost);
    };
  }, [socket]);

  const likeHandler = async () => {
    try {
      const response = isLiked
        ? await putDataAPI(`/post/dislike-post/${post._id}`, {
            userId: userCurrent._id,
          })
        : await putDataAPI(`/post/like-post/${post._id}`, {
            userId: userCurrent._id,
          });
      const { message } = response;
      toast.success(message, { autoClose: 2000 });

      if (!isLiked && post?.userId !== userCurrent?._id) {
        const responseCreateNotification = await postDataAPI("/notification", {
          link: "/post/" + post?._id,
          receiverId: post?.userId,
          text: userCurrent?.userName + " liked on your post",
          senderId: userCurrent?._id,
        });

        const { notification } = responseCreateNotification;

        socket?.emit("createNotification", { notification });
      }
      setIsLiked((prev) => !prev);
      setLike((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleCreateComment = async (e, text) => {
    e.preventDefault();
    try {
      const commentInfo = {
        postId: post?._id,
        userId: userCurrent?._id,
        text,
        images: [],
      };

      const images = await imageUpload(files);
      commentInfo.images = [...images];

      const response = await postDataAPI(`/comment`, commentInfo);

      const { comment, message } = response;

      const responseAddToPost = await postDataAPI(
        `/post/add-comment/${post?._id}`,
        {
          commentId: comment?._id,
        }
      );

      toast.success(message, { autoClose: 2000 });

      const responseCreateNotification = await postDataAPI("/notification", {
        link: "/post/" + post?._id,
        receiverId: post?.userId,
        text: userCurrent?.userName + " commented on your post",
        senderId: userCurrent?._id,
      });

      const { notification } = responseCreateNotification;

      socket?.emit("createNotification", { notification });

      setComments((prev) => [comment, ...prev]);
      setFiles([]);
    } catch (err) {
      console.log("err", err);
    }
  };

  const handleRemovePost = async () => {
    try {
      const response = await deleteDataAPI(`/post/${post?._id}`);

      const { message } = response;

      toast.success(message, { autoClose: 2000 });

      setPosts((prev) => prev.filter((item) => item._id !== post?._id));

      socket.emit("postHandler", {
        type: "remove",
        post,
        userFollowings: userCurrent?.followings,
        message: `${userCurrent?.userName} just edit a new post`,
      });
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <>
      <div className={className ? className : "post"}>
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              <Avatar user={user} width="50px" height="50px" />

              <span className="postUsername">{user?.userName}</span>
              <span className="postDate">
                {timeago.format(post?.createdAt)}
              </span>
            </div>

            {post?.userId === userCurrent?._id && (
              <div className="postTopRight">
                <span
                  className="CrudPost"
                  onClick={() => setIsCrudPost(!isCrudPost)}
                >
                  <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAFBJREFUSEtjZKAxYKSx+Qwjy4L/aMFJlO+JUgQ1eNQC2iRYUuKALBeQYsFoJBMMYpoHEUEXYFNASiTT3AKaB9GoBWTFIUFNgyoVEXTtgOQDAEM9DBleh0KcAAAAAElFTkSuQmCC" />
                </span>

                {isCrudPost && (
                  <div className="postCrudAction">
                    <CrudPost id={post?._id} setIsEdit={setIsEdit} />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="postCenter">
            <span className="postText">{post?.desc}</span>
            <div className="postImgContainer">
              {post?.images.map((image, idx) => {
                return (
                  <div
                    className="postImg"
                    key={image.url}
                    style={{
                      width: `${
                        post.images.length % 2 !== 0
                          ? idx === post.images.length - 1
                            ? "100%"
                            : "calc(100%/2)"
                          : "calc(100%/2)"
                      }`,
                    }}
                  >
                    <img src={image.url} alt="" />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <i
                className={`bx ${
                  isLiked ? "bxs-heart has-like" : "bx-heart"
                } likeIcon`}
                onClick={debounce(likeHandler, 2000)}
              ></i>
              <span className="postLikeCounter">{like} people like it</span>
            </div>
            <div
              className="postBottomRight"
              onClick={() => {
                let newIdComment = post?._id;
                let newIdPostOpen = post?._id;
                if (idPostOpen === post?._id) {
                  newIdPostOpen = null;
                  newIdComment = null;
                }
                dispatch({
                  type: UPDATE_ID_COMMENT,
                  payload: {
                    idComment: newIdComment,
                    idPostOpen: newIdPostOpen,
                  },
                });
                setIsShowComment(!isShowComment);
              }}
            >
              {comments.length ? (
                <span className="postCommentText">{comments.length}</span>
              ) : (
                ""
              )}
              <i className="bx bx-comment postCommentIcon"></i>
            </div>
          </div>

          <div className="commentContainer">
            {idComment === post?._id && (
              <CreateComment
                id={idCreateComment.current}
                files={files}
                setFiles={setFiles}
                user={userCurrent}
                onCreateComment={handleCreateComment}
              />
            )}

            <div className="displayComment">
              {isShowComment &&
                comments.map((comment) => (
                  <div className="comment" key={comment._id}>
                    <Comment
                      setComments={setComments}
                      post={post}
                      comment={comment}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {isEdit && (
          <ModalEditPost
            setPosts={setPosts}
            setIsEdit={setIsEdit}
            post={post}
          />
        )}
      </div>

      <ModalConfirmDelete
        onRemove={handleRemovePost}
        id={post?._id}
        text="this post ?"
      />
    </>
  );
}
