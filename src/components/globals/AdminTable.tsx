import React from "react";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import "../../styles/AdminTable.component.css";
import { Event, MongoDbUser, Poll } from "../../types/types";

interface AdminTableProps {
  list: Poll[] | Event[] | MongoDbUser[];
}

const AdminTable: React.FC<AdminTableProps> = ({ list }) => {
  if (list.length === 0) {
    return (
      <div className="adminTable-content">
        <p>No data available</p>
      </div>
    );
  }

  const isPoll = (item: Poll | Event | MongoDbUser): item is Poll => {
    return (item as Poll).subjects !== undefined;
  };

  const isEvent = (item: Poll | Event | MongoDbUser): item is Event => {
    return (item as Event).startDate !== undefined;
  };

  const isUser = (item: Poll | Event | MongoDbUser): item is MongoDbUser => {
    return (item as MongoDbUser).role !== undefined;
  };

  return (
    <div className="adminTable-content">
      <table className="adminTable-table">
        <thead>
          <tr>
            {isPoll(list[0]) ? (
              <>
                <th>Question</th>
                <th>Created By</th>
                <th>Total Votes</th>
                <th>Actions</th>
              </>
            ) : isEvent(list[0]) ? (
              <>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Created By</th>
                <th>Actions</th>
              </>
            ) : isUser(list[0]) ? (
              <>
                <th>User</th>
                <th>Email</th>
                <th>Location</th>
                <th>Reports</th>
                <th>Roles</th>
                <th>Actions</th>
              </>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              {isPoll(item) ? (
                <>
                  <td>{item.title}</td>
                  <td>{item.createdBy}</td>
                  <td>{item.attendances}</td>
                  <td>
                    <button className="adminTable-button-edit">
                      <HiOutlinePencilSquare />
                    </button>
                    <button className="adminTable-button-delete">
                      <HiOutlineTrash />
                    </button>
                  </td>
                </>
              ) : isEvent(item) ? (
                <>
                  <td>{item.title}</td>
                  <td>
                    {new Date(item.startDate).toLocaleDateString()}{" "}
                    {item.endDate
                      ? `- ${new Date(item.endDate).toLocaleDateString()}`
                      : ""}
                  </td>
                  <td>{item.location}</td>
                  <td>{item.createdBy}</td>
                  <td>
                    <button className="adminTable-button-edit">
                      <HiOutlinePencilSquare />
                    </button>
                    <button className="adminTable-button-delete">
                      <HiOutlineTrash />
                    </button>
                  </td>
                </>
              ) : isUser(item) ? (
                <>
                  <td>{item.name}</td>
                  <td>{item._id}</td>
                  <td>{item.location}</td>
                  <td>{item.notifications.length}</td>
                  <td>{item.role}</td>
                  <td>
                    <button className="adminTable-button-edit">
                      <HiOutlinePencilSquare />
                    </button>
                    <button className="adminTable-button-delete">
                      <HiOutlineTrash />
                    </button>
                  </td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
