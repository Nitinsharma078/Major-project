/*  Right side*/
import React, { useState, useEffect } from "react";
import { Button, List, Avatar, Input } from "antd";
import { StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import "./rightSide.css";
import Task from "./Task";

import UsersComponent from "./User";
import { GrTask } from "react-icons/gr";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { TbArrowRoundaboutRight } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";
import { GrStatusGoodSmall } from "react-icons/gr";
import { FcMediumPriority } from "react-icons/fc";
import { FaRegUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

import Support from "./Support";
import UserTable from "./User";
const { Search } = Input;

const RightSide = ({
  tasks,
  filter,
  searchQuery,
  viewMode,
  users,
  hideHeader,
  showHeader,

  selectedTask,
  setSelectedTask
}) => {
  console.log("vivek", filter);
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedTask, setSelectedTask] = useState(null);

  const [data, setData] = useState(null);
  const [search, setSearch] = useState("");
  console.log(search);

  const itemsPerPage = viewMode === "list" ? 7: 3;
  console.log("---", tasks);
  // const data1 = useSelector((state) => state.tasksReducer.tasks);
  // console.log("datatas", data1);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filter, viewMode]);

  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase() || search.toLowerCase();
    console.log("v1", query);
    const matchesSearchQuery =
      task.task_title.toLowerCase().includes(query) ||
      task.priority.toLowerCase().includes(query) ||
      task.status.toLowerCase().includes(query) ||
      task.assign_date.toLowerCase().includes(query) ||
      task.due_date.toLowerCase().includes(query);

    if (!searchQuery) {
      if (filter === "home") return true;
      if (filter === "my_issues") return task.status !== "Done";
      if (filter === "completed") return task.status === "Done";
      return true;
    }

    if (filter === "home") return matchesSearchQuery;
    if (filter === "my_issues")
      return task.status !== "Done" && matchesSearchQuery;
    if (filter === "completed")
      return task.status === "Done" && matchesSearchQuery;
    return matchesSearchQuery;
  });

  const handleTaskCardClick = (task) => {
    setSelectedTask(task);
    hideHeader();
  };

  const handleBackToList = () => {
    setSelectedTask(null);
    showHeader();
  };
  console.log("--n",filter);

  const renderTasksByStatus = (status) => {

    const tasksByStatus = filteredTasks.filter(
      (task) => task.status.toLowerCase() === status.toLowerCase()
    );
    console.log("renderTasksByStatus", tasksByStatus, filteredTasks);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = tasksByStatus.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);



    return paginatedTasks.map((task, index) => {
      const user =
        users && users.find((user) => user.name === task.assignedUser);
      return (
        <div
          key={index}
          className="task-card"
          onClick={() => handleTaskCardClick(task)}
        >
          <p className="header-task p-1">
            <GrTask /> : {task.task_title}
          </p>
          <p className="discrip p-2">
            <TbArrowRoundaboutRight /> :{" "}
            {task.description.slice(0,25) + "..."}
          </p>
          <div className="date-2 p3">
            <p>
              <MdOutlineTipsAndUpdates /> : {task.assign_date}
            </p>
            <p>
              <GrValidate /> : {task.due_date}
            </p>
          </div>
          <div className="Horigental p-4">
            <p>
              <GrStatusGoodSmall /> : {task.status}
            </p>
            <p>
              <FcMediumPriority /> : {task.priority}
            </p>
            {console.log("e===>>", task)}
          </div>
          <p className="p-5">
            <FaRegUser /> : {user ? user.name : "Assign"}
          </p>
        </div>

      );
    });
  };

  const renderTaskList = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return (
      <List
        itemLayout="horizontal"
        className="Listview"
        dataSource={paginatedTasks}
        renderItem={(item, index) => {
          const user =
            users && users.find((user) => user.name === item.assignedUser);
          return (
            <List.Item onClick={() => handleTaskCardClick(item)}>
              <List.Item.Meta
                avatar={
                  <Avatar
                    className="avtar"
                    src={`https://api.dicebear.com/7.x/icons/svg?seed=${index}&style=task`}
                  />
                }
                title={<div className="list-task"> {item.task_title}</div>}
                description={
                  <div className="list-task">
                    <div className="list-task-1">
                      <TbArrowRoundaboutRight />{" "}
                      {item.description.split(" ").slice(0, 5).join(" ") +
                        "..."}
                    </div>
                    <div>
                      <MdOutlineTipsAndUpdates /> {item.assign_date}
                    </div>
                    <div>
                      <GrStatusGoodSmall /> {item.status}
                    </div>
                    <div>
                      <FcMediumPriority /> {item.priority}
                    </div>
                    <div>
                      <GrValidate /> {item.due_date}
                    </div>
                    <div>
                      <FaUserCircle /> {user ? user.name : " User"}
                    </div>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />
    );
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  console.log(filteredTasks.length,"hame");

  return (
    <div className={`right-side ${viewMode === "list" ? "list-view" : ""}`}>
      {filter === "support" ? (
        <div className="support">
          <Support />
        </div>
      ) : filter === "users" ? (
        <UserTable users={users} />
      ) :
       (
        <>
          {!selectedTask ? (
            viewMode === "grid" ? (
              <div className="tasks-grid">
                {filter === "completed" ? (
                  ""
                ) : (
                  <div className="column">
                    <div className="point">
                      <div className="todo"></div>
                      <h3>ToDo</h3>
                    </div>
                    <div className="col-1">{renderTasksByStatus("Todo")}</div>
                  </div>
                )}
                {filter === "completed" ? (
                  ""
                ) : (
                  <div className="column">
                    <div className="point">
                      <div className="pro"></div>
                      <h3>InProgress</h3>
                    </div>
                    {renderTasksByStatus("InProgress")}
                  </div>
                )}
                {filter === "my_issues" ? (
                  ""
                ) : (
                  <div className="column">
                    <div className="point">
                      <div className="done"></div>
                      <h3>Done</h3>
                    </div>
                    {renderTasksByStatus("Done")}
                  </div>
                )}
                {filter === "completed" ? (
                  ""
                ) : (
                  <div className="column">
                    <div className="point">
                      <div className="in"></div>
                      <h3>InDevReview</h3>
                    </div>
                    {renderTasksByStatus("InDevReview")}
                  </div>
                )
                }
              </div>


            ) : (<div className="tasks-list">{renderTaskList()}</div>)
          ) : (
            <div className="task-details">
              <Task setCurrentPage
             task={selectedTask} handleBackToList={handleBackToList} />
            </div>
          )}
          {!selectedTask ? (
            <div className="pagination-controls">
              <div className="pagination-btn-1" >
              <Button
                type="primary"
                icon={<StepBackwardOutlined />}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              />
              </div>
             <div className="pagination-btn-1">
             <Button
                type="primary"
                icon={<StepForwardOutlined />}
                onClick={handleNextPage}
                disabled={filteredTasks.length <= currentPage * itemsPerPage}
              />
             </div>

            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  );
};

export default RightSide;
