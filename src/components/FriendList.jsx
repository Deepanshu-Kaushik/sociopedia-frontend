import React from "react";
import Card from "./Card";
import Friend from "./Friend";
import { Link } from "react-router-dom";

export default function FriendList({ userId, friendList, setFriendList }) {
  return (
    <>
      <Card customStyle="w-full">
        <h1 className="mb-4">Friend List</h1>
        {!friendList?.hasOwnProperty("error") && (
          <div className="flex flex-col">
            {friendList?.map((friend) => (
              <Link
                to={"/profile/" + friend?.userId}
                key={friend?.userId}
                className='hover:bg-slate-200 p-2 w-full rounded-lg'
              >
                <Friend
                  userId={userId}
                  friendList={friendList}
                  setFriendList={setFriendList}
                  data={friend}
                />
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
