import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { UPDATE_INFO_GET_POST } from "../../redux/actions";

const GetMorePost = ({ postsLength, limit }) => {
  const divRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const payload = {
            skip: postsLength,
            limit: limit + 2,
            isLoadingPost: true,
          };
          dispatch({
            type: UPDATE_INFO_GET_POST,
            payload,
          });
        }
      });
    });
    observer.observe(divRef.current);

    return () => {
      if (!divRef.current) return;
      observer.unobserve(divRef.current);
    };
  }, []);

  return <div ref={divRef}>Get More Post</div>;
};

export default GetMorePost;
