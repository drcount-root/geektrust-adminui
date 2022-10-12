import {
  Container,
  Row,
  Col,
  Form,
  Stack,
  Table,
  Button,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import Paginate from "./components/Paginate";
import UpdateUser from "./components/UpdateUser";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedUsersId, setCheckedUsersId] = useState([]);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const POST_PER_PAGE = 10;
  const API_URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";

  const updateUser = (userId) => {
    setUpdateUserId(userId);
    setModalShow(true);
  };

  const onSelectAll = (event) => {
    let updatedList = [...selectedUsersId];
    if (event.target.checked) {
      setIsAllChecked(true);
      updatedList = currentUsers.map((user) => user.id);
    } else {
      setIsAllChecked(false);
      updatedList = [];
    }
    setCheckedUsersId(updatedList);
  };

  const deleteSelected = () => {
    const updatedList = users.filter(
      (user) => !selectedUsersId.includes(user.id)
    );
    setUsers(updatedList);
    setIsAllChecked(false);
  };

  const onSelect = (event) => {
    const userId = event.target.value;
    let updatedList = [...selectedUsersId];

    if (event.target.checked) {
      updatedList = [...selectedUsersId, userId];
    } else {
      setIsAllChecked(false);
      updatedList.splice(selectedUsersId.indexOf(userId), 1);
    }
    setCheckedUsersId(updatedList);
  };

  const onDelete = (userId) => {
    const updatedList = users.filter((user) => user.id !== userId);
    setUsers(updatedList);
  };

  const onSearch = (event) => {
    setSearchKey(event.target.value);
  };

  const filter = () => {
    if (searchKey !== "") {
      const result = users.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(searchKey))
      );
      setFilteredUsers(result);
    } else {
      setFilteredUsers(users);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (error) {
      console.log("Error in getting users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filter();
  }, [users, searchKey]);

  /* Pagination */
  const indexOfLastUser = currentPage * POST_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - POST_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / POST_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Search onSearch={onSearch} />
        </Col>
      </Row>
      <Row>
        <Col className="mt-2">
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>
                  <Form.Check
                    type="checkbox"
                    onChange={onSelectAll}
                    checked={isAllChecked}
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length ? (
                currentUsers.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className={
                        selectedUsersId.includes(user.id) ? "bg-gray" : ""
                      }
                    >
                      <td>
                        <Form.Check
                          type="checkbox"
                          value={user.id}
                          onChange={onSelect}
                          checked={selectedUsersId.includes(user.id)}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <Stack direction="horizontal" gap={2}>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => updateUser(user.id)}
                          >
                            <i className="bi bi-pencil-square text-primary"></i>
                          </Button>

                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => onDelete(user.id)}
                          >
                            <i className="bi bi-trash text-danger"></i>
                          </Button>
                        </Stack>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    No User Found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
      {currentUsers.length > 0 ? (
        <Row className="pt-2 pt-md-0">
          <Col xs="12" md="4">
            <Button
              variant="danger"
              size="sm"
              onClick={deleteSelected}
              disabled={selectedUsersId.length > 0 ? false : true}
            >
              Delete Selected
            </Button>
          </Col>
          <Col xs="12" md="8">
            <Paginate
              currentPage={currentPage}
              paginate={paginate}
              totalPages={totalPages}
            />
          </Col>
        </Row>
      ) : (
        ""
      )}
      {modalShow ? (
        <UpdateUser
          users={users}
          setUsers={setUsers}
          userId={updateUserId}
          setModalShow={setModalShow}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
      ) : (
        ""
      )}
    </Container>
  );
}

export default App;
