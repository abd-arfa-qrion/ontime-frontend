import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  TextField,
  TableSortLabel,
  InputAdornment,
  Button,
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "../../../skeleton/tableRow";
import { Resume7HariPerbulanGuru } from "@/type/Dashboard.type";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { formatBulanIndonesia } from "@/utils/formatdate";
type Proptype = {
  dataGuru: Resume7HariPerbulanGuru[];
  session: any;
  loadingFetch: boolean;
  filterTA: string;
};
const DataTableDashboardGuru7Hari = (prop: Proptype) => {
  const { dataGuru, session, loadingFetch, filterTA } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] =
    useState<Resume7HariPerbulanGuru[]>(dataGuru);
  const [sortField, setSortField] = useState<
    keyof Resume7HariPerbulanGuru | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // const tasem = getTahunAjaranWithSemester();

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(0);
    setSearchLoading(true);
    // kasih delay supaya ada efek loading sebentar
    setTimeout(() => {
      setSearchLoading(false);
    }, 800);
  };

  const handleSort = (field: keyof Resume7HariPerbulanGuru) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(dataGuru ?? []);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    // kasih debounce kecil biar gak ke-trigger tiap ketik huruf
    const timer = setTimeout(() => {
      const result = (dataGuru ?? []).filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );

      setFilteredData(result);
      setSearchLoading(false);
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [searchQuery, dataGuru]);
  /// Perubahan sampai sini

  const sortedData = [...(filteredData ?? [])].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Absensi Guru Tahun Ajaran {filterTA}
          </h4>

          {/* KANAN */}
          <div className="flex items-center gap-2">
            <div className="w-64">
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "10px",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>
        </div>
        {/* Field Search dengan Icon */}

        <TableContainer className="mt-5">
          <Table>
            <TableHead className="bg-green-100">
              <TableRow>
                <TableCell className="font-[550]">No</TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "bulan"}
                    direction={sortField === "bulan" ? sortOrder : "asc"}
                    onClick={() => handleSort("bulan")}
                  >
                    Bulan
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "total_guru"}
                    direction={sortField === "total_guru" ? sortOrder : "asc"}
                    onClick={() => handleSort("total_guru")}
                  >
                    Jumlah Siswa
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "persen_kehadiran"}
                    direction={
                      sortField === "persen_kehadiran" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("persen_kehadiran")}
                  >
                    Persentase Hadir
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "persen_tidak_hadir"}
                    direction={
                      sortField === "persen_tidak_hadir" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("persen_tidak_hadir")}
                  >
                    Persentase Tidak Hadir
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingFetch ? (
                <TableRowSkeleton columns={5} />
              ) : searchLoading ? (
                <TableRowSkeleton columns={5} />
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <p className="text-gray-500 text-sm mb-4">
                      Resume 7 Hari Perbulan Belum dapat ditampilkan!
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{formatBulanIndonesia(row.bulan)}</TableCell>
                      <TableCell>{row.total_guru}</TableCell>
                      <TableCell>{row.persen_kehadiran}</TableCell>
                      <TableCell>{row.persen_tidak_hadir}</TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Baris:"
          labelDisplayedRows={({ from, to, count }) =>
            `Menampilkan ${from} - ${to} dari ${count} Data`
          }
          sx={{
            "& .MuiTablePagination-toolbar": {
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            },

            // pindahkan label ke kiri
            "& .MuiTablePagination-displayedRows": {
              order: -1,
              marginRight: "auto",
              marginLeft: 0,
              color: "#7e7e7e",
            },

            // spacer bawaan dimatikan
            "& .MuiTablePagination-spacer": {
              display: "none",
            },
          }}
        />
      </Paper>
    </>
  );
};

export default DataTableDashboardGuru7Hari;
