import React from "react";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import "../../styles/AdminTable.component.css";
import { Event, MongoDbUser, Poll } from "../../types/types";
import { MdOutlineCheck, MdOutlineClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import profile from "../../assets/images/profile.webp";

interface AdminTableProps {
  list: Poll[] | Event[] | MongoDbUser[];
  setPopupRefusalEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupApproveEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent?: React.Dispatch<React.SetStateAction<Event | null>>;
  setPopupDeletePoll?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedPoll?: React.Dispatch<React.SetStateAction<Poll | null>>;

  setPopupDeleteUser?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupEditUser?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedUser?: React.Dispatch<React.SetStateAction<MongoDbUser | null>>;
}

const AdminTable: React.FC<AdminTableProps> = ({
  list,
  setPopupRefusalEvent,
  setSelectedEvent,
  setPopupApproveEvent,
  setPopupDeletePoll,
  setSelectedPoll,
  setSelectedUser,
  setPopupDeleteUser,
  setPopupEditUser,
}) => {
  const location = useLocation();
  if (list.length === 0) {
    return (
      <div className="adminTable-content">
        <p>No data available</p>
      </div>
    );
  }

  const isPoll = (item: Poll | Event | MongoDbUser): item is Poll => {
    return (item as Poll).options !== undefined;
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
            {isEvent(list[0]) ? (
              <>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th className="optional">Created By</th>
                <th>Actions</th>
              </>
            ) : isPoll(list[0]) ? (
              <>
                <th>Question</th>
                <th className="optional">Created By</th>
                <th>Total Votes</th>
                <th id="adminTable-polls-container">Actions</th>
              </>
            ) : isUser(list[0]) ? (
              <>
                <th>Name</th>
                <th style={{ width: "5%" }}>Profile</th>
                <th className="optional">Location</th>
                <th>Role</th>
                <th style={{ width: "5%" }}>Actions</th>
              </>
            ) : (
              <th>No data found</th>
            )}
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              {isPoll(item) ? (
                <>
                  <td>{item.question}</td>
                  <td className="optional">{item.createdByUsername}</td>
                  <td>
                    {item.options.reduce(
                      (total, curr) => total + curr.votes,
                      0,
                    )}
                  </td>
                  <td id="adminTable-polls-buttons-container">
                    <Link
                      to={`/brightpolls/${item._id}`}
                      state={{ admin: "/brightadmin/polls" }}
                      className="adminTable-button-edit poll-edit-admin"
                    >
                      <HiOutlinePencilSquare />
                    </Link>
                    <button className="adminTable-button-delete poll-delete-admin">
                      <HiOutlineTrash
                        onClick={() => {
                          setPopupDeletePoll?.(true);
                          setSelectedPoll?.(item);
                        }}
                      />
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
                  <td>
                    {item.location === "all" ? "All locations" : item.location}
                  </td>
                  <td className="optional">{item.createdBy}</td>
                  <td>
                    {item.validated ? (
                      <>
                        <Link
                          to={`/brightevents/${item._id}`}
                          state={{ linkBack: location.pathname }}
                          className="adminTable-button-edit edit"
                        >
                          <HiOutlinePencilSquare />
                        </Link>
                      </>
                    ) : (
                      <div className="adminTable-buttons-pending">
                        <button className="adminTable-button-delete refuse">
                          <MdOutlineClose
                            onClick={() => {
                              setPopupRefusalEvent?.(true);
                              setSelectedEvent?.(item);
                            }}
                          />
                        </button>
                        <button className="adminTable-button-edit accept">
                          <MdOutlineCheck
                            onClick={() => {
                              setPopupApproveEvent?.(true);
                              setSelectedEvent?.(item);
                            }}
                          />
                        </button>
                        <Link
                          to={`/brightevents/${item._id}`}
                          state={{ linkBack: location.pathname }}
                          className="adminTable-button-edit edit"
                        >
                          <HiOutlinePencilSquare />
                        </Link>
                      </div>
                    )}
                  </td>
                </>
              ) : isUser(item) ? (
                <>
                  <td>{item.name} </td>
                  <td style={{ textAlign: "center", padding: "7px" }}>
                    <img
                      src={
                        item.picture === "not-found" ? profile : item.picture
                      }
                      alt={item.name}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                    />
                  </td>
                  <td className="optional">
                    {item.location === "all"
                      ? "All locations (office)"
                      : item.location}
                  </td>
                  <td>{item.role === "admin" ? "Admin" : "User"}</td>
                  <td>
                    <button className="adminTable-button-edit poll-edit-admin">
                      <HiOutlinePencilSquare
                        onClick={() => {
                          setPopupEditUser?.(true);
                          setSelectedUser?.(item);
                        }}
                      />
                    </button>
                    <button className="adminTable-button-delete delete">
                      <HiOutlineTrash
                        onClick={() => {
                          setPopupDeleteUser?.(true);
                          setSelectedUser?.(item);
                        }}
                      />
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
