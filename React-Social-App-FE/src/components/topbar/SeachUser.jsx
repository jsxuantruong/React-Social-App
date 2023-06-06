import { Search } from "@material-ui/icons";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDataAPI } from "../../api/fetchData";
import { debounce } from "../../helpers/debounceFunction";
import Avatar from "../avatar/Avatar";

const SeachUser = () => {
  const [usersSearch, setUsersSearch] = useState();
  const [isShowUsersSearch, setIsShowUsersSearch] = useState(false);
  const searchInputRef = useRef();
  const searchRef = useRef();
  const navigate = useNavigate();

  const { elClick } = useSelector((state) => state.global);

  useEffect(() => {
    if (searchRef.current.contains(elClick)) return;
    setIsShowUsersSearch(false);
  }, [elClick]);

  const handleSearchUsers = async () => {
    if (!searchInputRef?.current?.value) {
      return;
    }
    try {
      const response = await getDataAPI(
        `/user/search-user/${searchInputRef.current.value}`
      );

      const { users } = response;

      if (users.length) {
        setIsShowUsersSearch(true);
        setUsersSearch(users);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  return (
    <div className="searchbar" ref={searchRef}>
      <Search className="searchIcon" />
      <input
        ref={searchInputRef}
        placeholder="Search for friend, post or video"
        className="searchInput"
        onFocus={() => {
          if (!isShowUsersSearch) setIsShowUsersSearch(true);
        }}
        onChange={debounce(handleSearchUsers, 2000)}
      />

      {usersSearch && isShowUsersSearch && (
        <div className="displayUsersSearch">
          {usersSearch.map((user) => (
            <div
              className="userSearchContainer"
              key={user?._id}
              onClick={() => navigate(`/profile/${user?._id}`)}
            >
              <Avatar user={user} />
              <span>{user?.userName}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeachUser;
