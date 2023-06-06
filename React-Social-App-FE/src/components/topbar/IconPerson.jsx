import { Person } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import BoxFriendRequests from "./BoxFriendRequests";

const IconPerson = () => {
  const [isShowFriendRequests, setIsShowFriendRequests] = useState(false);
  const { number: numberFriendRequest } = useSelector(
    (state) => state.friendRequest
  );
  const { elClick } = useSelector((state) => state.global);

  const divRef = useRef();
  useEffect(() => {
    if (divRef.current.contains(elClick)) return;
    setIsShowFriendRequests(false);
  }, [elClick]);

  return (
    <div ref={divRef}>
      <Person onClick={() => setIsShowFriendRequests((prev) => !prev)} />
      {isShowFriendRequests && <BoxFriendRequests />}
      <span className="topbarIconBadge">{numberFriendRequest}</span>
    </div>
  );
};

export default IconPerson;
