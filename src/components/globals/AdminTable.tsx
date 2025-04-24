import React from "react";
import { HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";
import "../../styles/AdminTable.component.css";
import { Event, MongoDbUser, Poll } from "../../types/types";
import { MdOutlineCheck, MdOutlineClose } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";

interface AdminTableProps {
  list: Poll[] | Event[] | MongoDbUser[];
  setPopupRefusalEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupApproveEvent?: React.Dispatch<React.SetStateAction<boolean>>;
  setPopupDeletePoll?: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedEvent?: React.Dispatch<React.SetStateAction<Event | null>>;
  setSelectedPoll?: React.Dispatch<React.SetStateAction<Poll | null>>;
}

const AdminTable: React.FC<AdminTableProps> = ({ list, setPopupRefusalEvent, setSelectedEvent, setPopupApproveEvent, setPopupDeletePoll, setSelectedPoll }) => {

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
                <th>Created By</th>
                <th>Actions</th>
              </>
            ) : isPoll(list[0]) ? (
              <>
                <th>Question</th>
                <th>Created By</th>
                <th>Total Votes</th>
                <th id="adminTable-polls-container">Actions</th>
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
            ) : <th>No data found</th>
            }
          </tr>
        </thead>
        <tbody>
          {list.map((item, index) => (
            <tr key={index}>
              {isPoll(item) ? (
                <>
                  <td>{item.question}</td>
                  <td>{item.createdByUsername}</td>
                  <td>{item.options.reduce((total, curr) => total + curr.votes, 0)}</td>
                  <td id="adminTable-polls-buttons-container">
                    <Link to={`/brightpolls/${item._id}`} state={{admin: '/brightadmin/polls'}} className="adminTable-button-edit poll-edit-admin">
                      <HiOutlinePencilSquare />
                    </Link>
                    <button className="adminTable-button-delete poll-delete-admin">
                      <HiOutlineTrash onClick={() => {
                        setPopupDeletePoll?.(true);
                        setSelectedPoll?.(item);
                      }} />
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
                    {
                      item.validated ?
                        <>
                          <Link to={`/brightevents/${item._id}`} state={{ linkBack: location.pathname }} className="adminTable-button-edit edit">
                            <HiOutlinePencilSquare />
                          </Link>
                        </>
                        :
                        <div className="adminTable-buttons-pending">
                          <button className="adminTable-button-delete refuse">
                            <MdOutlineClose onClick={() => {
                              setPopupRefusalEvent?.(true);
                              setSelectedEvent?.(item);
                            }} />
                          </button>
                          <button className="adminTable-button-edit accept">
                            <MdOutlineCheck onClick={() => {
                              setPopupApproveEvent?.(true);
                              setSelectedEvent?.(item);
                            }} />
                          </button>
                          <Link to={`/brightevents/${item._id}`} state={{ linkBack: location.pathname }} className="adminTable-button-edit edit">
                            <HiOutlinePencilSquare />
                          </Link>
                        </div>
                    }
                  </td>
                </>
              ) : isUser(item) ? (
                <>
                  <td>{item.name}</td>
                  <td>{item._id}</td>
                  <td>{item.location}</td>
                  <td>{item.updatedAt.length}</td>
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
