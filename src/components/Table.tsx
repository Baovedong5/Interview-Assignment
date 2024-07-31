import { useEffect, useState } from "react";
import { IUser } from "../types/user.type";
import { FaSort } from "react-icons/fa";

const Table = () => {
  const [listUser, setListUser] = useState<IUser[]>([]);
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  const fetchUser = async () => {
    const maxResults = 100;
    const response = await fetch(
      `https://randomuser.me/api/?page=${current}&results=${pageSize}&seed=abc`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    setListUser(data.results);
    setTotalPages(Math.ceil(maxResults / pageSize));
  };

  useEffect(() => {
    fetchUser();
  }, [current, pageSize]);

  const handleNextPage = () => {
    if (current < totalPages) {
      setCurrent(current + 1);
    }
  };

  const handlePreviousPage = () => {
    if (current > 1) {
      setCurrent(current - 1);
    }
  };

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...listUser].sort((a, b) => {
    if (sortConfig !== null) {
      const { key, direction } = sortConfig;
      const order = direction === "ascending" ? 1 : -1;
      if (key === "username") {
        return a.login.username.localeCompare(b.login.username) * order;
      } else if (key === "fullname") {
        const nameA = `${a.name.first} ${a.name.last}`;
        const nameB = `${b.name.first} ${b.name.last}`;
        return nameA.localeCompare(nameB) * order;
      }
    }
    return 0;
  });

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <FaSort className="text-gray-500" />; // Màu mặc định
    }
    return sortConfig.direction === "ascending" ? (
      <FaSort className="text-blue-500" /> // Màu khi sắp xếp tăng dần
    ) : (
      <FaSort className="text-red-500" /> // Màu khi sắp xếp giảm dần
    );
  };

  return (
    <div className="p-5 h-screen bg-gray-100">
      <h1 className="text-xl mb-2">Users</h1>
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">
              STT
            </th>
            <th
              className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
              onClick={() => handleSort("fullname")}
            >
              <div className="flex items-center">
                <span>FullName</span>
                {getSortIcon("fullname")}
              </div>
            </th>
            <th
              className="p-3 text-sm font-semibold tracking-wide text-left cursor-pointer"
              onClick={() => handleSort("username")}
            >
              <div className="flex items-center">
                <span>Username</span>
                {getSortIcon("username")}
              </div>
            </th>
            <th className="p-3 text-sm font-semibold tracking-wide text-left">
              Thumbnail Icon
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr className="bg-white" key={user.login.uuid}>
              <td className="p-3 text-sm text-gray-700">
                {index + 1 + (current - 1) * pageSize}
              </td>
              <td className="p-3 text-sm text-gray-700">
                {user.name.first} {user.name.last}
              </td>
              <td className="p-3 text-sm text-gray-700">
                {user.login.username}
              </td>
              <td className="p-3 text-sm text-gray-700">
                <img src={user.picture.thumbnail} alt="Thumbnail" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={current === 1}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {current} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={current === totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
