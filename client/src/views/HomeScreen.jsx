import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTasks, updateTaskStatus, deleteTask } from "../api.js";
import TaskModal from "../components/Modal/TaskModal.jsx";
import ConfirmDeleteModal from "../components/Modal/ConfirmDeleteModal.jsx"; // ✅ new modal
import { Autocomplete, TextField } from "@mui/material";
import ReactPaginate from "react-paginate";

const HomeScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [priority, setPriority] = useState("");
  const [status, setStatus] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [taskSelected, setTaskSelected] = useState({});

  // ✅ delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // ✅ pagination
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  // fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      const tasks = await getTasks(token);
      setTasks(tasks);
    };
    fetchTasks();
  }, []);

  // filter tasks by priority & status
  useEffect(() => {
    const filteredArray = tasks.filter((item) => {
      return (
        (!status || item.status === status) &&
        (!priority || item.priority === priority)
      );
    });
    setSortedTasks(filteredArray);
    setCurrentPage(0); // reset to first page when filters change
  }, [priority, status, tasks]);

  const handleTaskStatus = async (taskId) => {
    const token = localStorage.getItem("token");
    await updateTaskStatus(taskId, token);
    const tasks = await getTasks(token);
    setTasks(tasks);
  };

  // ✅ delete confirmation handler
  const handleDelete = async () => {
    if (!taskToDelete) return;
    const token = localStorage.getItem("token");
    await deleteTask(taskToDelete._id, token);
    const tasks = await getTasks(token);
    setTasks(tasks);
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  // pagination logic
  const offset = currentPage * itemsPerPage;
  const currentItems = sortedTasks.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedTasks.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="h-full bg-[#F2F2F7] text-black p-8 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-[#F2F2F7] bg-opacity-10 p-6 rounded-lg shadow-xl">
        {/* header + filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-black">Tasks</h1>
          <div className="flex items-center space-x-4">
            <span className="text-black">Filter:</span>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-[#F2F2F7] bg-opacity-5 border border-gray-600 text-[#3A3A3C] rounded-md p-2"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-[#F2F2F7] bg-opacity-5 border border-gray-600 text-[#3A3A3C] rounded-md p-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <button
              className="bg-[#34C759] hover:bg-green-600 px-4 py-2 rounded text-white transition"
              onClick={() => navigate("/task")}
            >
              Create Task
            </button>
          </div>
        </div>

        {/* table */}
        <div className="overflow-hidden bg-white bg-opacity-5 shadow-md rounded-lg">
          <table className="w-full text-left text-[#3A3A3C]">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Priority</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-[#3A3A3C]">
                    No tasks available
                  </td>
                </tr>
              ) : (
                currentItems.map((task) => (
                  <tr key={task._id} className="border-b border-gray-600">
                    <td
                      className="px-6 py-4 cursor-pointer text-black hover:underline"
                      onClick={() => setShowModal(true) || setTaskSelected(task)}
                    >
                      {task.title}
                    </td>
                    <td className="px-6 py-4 text-black">
                      {task.due_date.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <Autocomplete
                        size="small"
                        disablePortal
                        options={["pending", "completed"]}
                        value={task.status}
                        onChange={() => handleTaskStatus(task._id)}
                        sx={{ width: 150 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="standard"
                            sx={{ input: { color: "black" } }}
                          />
                        )}
                      />
                    </td>
                    <td
                      className={`px-6 py-4 font-bold ${
                        task.priority === "high"
                          ? "text-red-500"
                          : task.priority === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {task.priority}
                    </td>
                    <td className="px-6 py-4 space-x-2">
                      <button
                        className="bg-[#34C759] hover:bg-green-600 px-3 py-1 rounded text-white transition"
                        onClick={() =>
                          setShowModal(true) || setTaskSelected(task)
                        }
                      >
                        Read
                      </button>
                      <button
                        className="bg-[#007AFF] hover:bg-blue-600 px-3 py-1 rounded text-white transition"
                        onClick={() => navigate(`/task/${task._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-[#FF3B30] hover:bg-red-600 px-3 py-1 rounded text-white transition"
                        onClick={() => {
                          setTaskToDelete(task); // store whole task
                          setShowDeleteModal(true); // open modal
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-4">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"flex space-x-2"}
              pageClassName={"px-3 py-1 border rounded cursor-pointer"}
              activeClassName={"bg-[#007AFF] text-white"}
              previousClassName={"px-3 py-1 border rounded cursor-pointer"}
              nextClassName={"px-3 py-1 border rounded cursor-pointer"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && <TaskModal setShowModal={setShowModal} task={taskSelected} />}
      {showDeleteModal && (
        <ConfirmDeleteModal
          setShowDeleteModal={setShowDeleteModal}
          onConfirm={handleDelete}
          taskTitle={taskToDelete?.title} // ✅ show task title in modal
        />
      )}
    </div>
  );
};

export default HomeScreen;
