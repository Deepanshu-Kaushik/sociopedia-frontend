import { useEffect, useState } from 'react';
import UserInfo from './UserInfo';
import FriendList from '../Friends/FriendList';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingOutlined } from '@ant-design/icons';
import CreatePost from './CreatePost';
import Feed from './Feed';
import { UserType } from '../../types/user-type';
import { PostType } from '../../types/post-type';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserType>({});
  const [friendList, setFriendList] = useState<UserType[]>([]);
  const [feed, setFeed] = useState<PostType[]>([]);
  const { profileId } = useParams();
  const { token, userId } = localStorage;

  const fetchData = async (
    url: string,
    setter:
      | React.Dispatch<React.SetStateAction<UserType>>
      | React.Dispatch<React.SetStateAction<UserType[]>>
      | React.Dispatch<React.SetStateAction<PostType[]>>,
  ) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        setter(data);
      } else if (response.status === 403) {
        return navigate('/login');
      } else {
        throw new Error('Something went wrong!');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!token || !userId) {
      navigate('/login');
      return;
    }

    const getUserData = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${profileId}`,
      setUserData,
    );
    const getFriendList = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/user/${profileId}/friends`,
      setFriendList,
    );
    const getFeed = fetchData(
      `${import.meta.env.VITE_BACKEND_URL}/posts/${profileId}`,
      setFeed,
    );

    Promise.all([getUserData, getFriendList, getFeed]);
  }, [profileId]);

  if (!userData || !friendList || !feed) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <LoadingOutlined className='text-5xl text-sky-600' />
      </div>
    );
  }

  return (
    <div className='w-[90%] m-auto flex lg:flex-row flex-col py-6 gap-10 h-full'>
      <div className='flex flex-col gap-4 lg:w-[30%]'>
        <UserInfo
          userData={userData}
          friendList={friendList}
          setFriendList={setFriendList}
        />
        <FriendList
          userId={profileId}
          friendList={friendList}
          setFriendList={setFriendList}
        />
      </div>
      <div className='flex flex-col flex-1 gap-4'>
        {userId === profileId && (
          <CreatePost userData={userData} setFeed={setFeed} />
        )}
        <Feed
          friendList={friendList}
          setFriendList={setFriendList}
          feed={feed}
          setFeed={setFeed}
          userId={profileId}
        />
      </div>
    </div>
  );
}
