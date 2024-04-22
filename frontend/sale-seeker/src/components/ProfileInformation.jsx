import { makeFirstLetterUpperCase } from "./util/formating";

export default function ProfileInformation({ user }) {
  return (
    <div className="max-w-md bg-base-100 shadow-md rounded px-8 pt-6 pb-8 mb-4 self-center">
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-bold mb-4 text-center">{user.username}</h2>
        <img
          src={
            "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" ||
            user.avatar
          }
          alt="User avatar"
          className="w-24 h-24 rounded-full self-center mb-4"
        />
      </div>
      <ul className="list-none mb-4">
        <li className="flex items-center mb-2">
          <span className="w-24 text-base-600">Email:</span>
          <span className="text-base-900">{user.email}</span>
        </li>
        <li className="flex items-center mb-2">
          <span className="w-24 text-base-600">Role:</span>
          <span className="text-base-900">
            {makeFirstLetterUpperCase(user.role)}
          </span>
        </li>
      </ul>
    </div>
  );
}
