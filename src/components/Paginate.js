import { Pagination } from "react-bootstrap";

const Paginate = ({ currentPage, paginate, totalPages }) => {
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination className="float-md-end d-flex justify-content-center pt-2">
      <Pagination.First
        className={currentPage === 1 ? "disabled" : ""}
        onClick={() => paginate(1)}
      />
      <Pagination.Prev
        className={currentPage === 1 ? "disabled" : ""}
        onClick={() => paginate(currentPage - 1)}
      />

      {pageNumbers.map((number) => (
        <Pagination.Item
          className={number === currentPage ? "active" : ""}
          onClick={() => paginate(number)}
          key={number}
        >
          {number}
        </Pagination.Item>
      ))}
      <Pagination.Next
        className={currentPage === totalPages ? "disabled" : ""}
        onClick={() => paginate(currentPage + 1)}
      />
      <Pagination.Last
        className={currentPage === totalPages ? "disabled" : ""}
        onClick={() => paginate(totalPages)}
      />
    </Pagination>
  );
};

export default Paginate;
