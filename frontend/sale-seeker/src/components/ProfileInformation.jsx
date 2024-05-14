import { makeFirstLetterUpperCase } from "./util/formating";
import { motion } from "framer-motion";
import { formatDate } from "./util/formating";

export default function ProfileInformation({ user }) {
  const tableItems = [
    { label: "Email:", value: user.email },
    { label: "Role:", value: makeFirstLetterUpperCase(user.role) },
    { label: "Created at:", value: formatDate(user.created_at) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="max-w-100 bg-base-100 shadow-md rounded-b-box px-8 pt-6 pb-8 mb-4 flex flex-col justify-center align-center content-center"
    >
      <h2 className="text-lg font-bold mb-4 text-center">{user.username}</h2>
      <img
        src={
          "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" ||
          user.avatar
        }
        alt="User avatar"
        className="w-24 h-24 rounded-full self-center mb-4"
      />

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Information</th>
              <th className="px-4 py-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {tableItems.map((item, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <td className="px-4 py-2">{item.label}</td>
                <td className="px-4 py-2">{item.value}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
