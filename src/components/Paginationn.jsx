
import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts, setPaginationParams } from "../features/contacts/contactSlice";
import { Pagination, Box, Typography } from "@mui/material";

function Paginationn() {
  const dispatch = useDispatch();
  const { currentPage, itemsPerPage, totalPages, loading, error, activeSearchTerm, activeLabel } = useSelector((state) => state.contacts);


  const fetchCurrentPage = useCallback(() => {
    if (currentPage > 0 && itemsPerPage > 0) {
      dispatch(fetchContacts({
        page: currentPage,
        limit: itemsPerPage,
        searchTerm: activeSearchTerm,
        label: activeLabel,
      }));
    }
  }, [dispatch, currentPage, itemsPerPage, activeSearchTerm, activeLabel]);


  useEffect(() => {
    fetchCurrentPage();
  }, [fetchCurrentPage]);

  const handlePageChange = (event, value) => {
    dispatch(setPaginationParams({ page: value }));
  };


  return (
    <Box display="flex" justifyContent="center" mt={4}>
      {totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          showFirstButton
          showLastButton
        />
      )}
      {loading && <Typography align="center" mt={2}>Loading contacts...</Typography>}
      {error && <Typography align="center" mt={2} color="error">Error: {error}</Typography>}
    </Box>
  );
}

export default Paginationn;