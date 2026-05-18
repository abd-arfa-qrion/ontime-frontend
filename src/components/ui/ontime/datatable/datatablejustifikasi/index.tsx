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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "../../../skeleton/tableRow";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
import { formatCreatedAt } from "@/utils/formatdate";
import { Justifikasi } from "@/type/Justifikasi.type";
import ModalUpdateJustifikasi from "@/components/view/admin/Justifikasi/ModalUpdate";
type Proptype = {
  data: Justifikasi[];
  setData: Dispatch<SetStateAction<Justifikasi[]>>;
  session: any;
  loadingFetch: boolean;
  setToaster: Dispatch<SetStateAction<{}>>;
};
const DataTableJustifikasi = (prop: Proptype) => {
  const { data, setData, session, loadingFetch, setToaster } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Justifikasi[]>(data);
  const [sortField, setSortField] = useState<keyof Justifikasi | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isLoading, setIsLoading] = useState<string>("");

  const [updateJustifikasi, setUpdateJustifikasi] = useState<Justifikasi | {}>(
    {},
  );

  const tasem = getTahunAjaranWithSemester();

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

  const handleSort = (field: keyof Justifikasi) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data ?? []);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    // kasih debounce kecil biar gak ke-trigger tiap ketik huruf
    const timer = setTimeout(() => {
      const result = (data ?? []).filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );

      setFilteredData(result);
      setSearchLoading(false);
    }, 300); // debounce 300ms
    return () => clearTimeout(timer);
  }, [searchQuery, data]);
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
  const handleEdit = async (id: number) => {
    setIsLoading("editBtn");

    const editingData = data.find((item) => item.id === id);
    console.log("menampilkan data: ", editingData);
    setUpdateJustifikasi(editingData ?? {});
    setIsLoading("");
  };

  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Justifikasi Absensi Siswa Tahun Ajaran {tasem.ta}
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
                    active={sortField === "student_name"}
                    direction={sortField === "student_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("student_name")}
                  >
                    Nama Siswa
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "class_name"}
                    direction={sortField === "class_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("class_name")}
                  >
                    Kelas
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "waktu_absensi"}
                    direction={
                      sortField === "waktu_absensi" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("waktu_absensi")}
                  >
                    Tanggal
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550] w-1 whitespace-nowrap">
                  <TableSortLabel
                    active={sortField === "status_hadir"}
                    direction={sortField === "status_hadir" ? sortOrder : "asc"}
                    onClick={() => handleSort("status_hadir")}
                  >
                    Status Awal
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "status_akhir"}
                    direction={sortField === "status_akhir" ? sortOrder : "asc"}
                    onClick={() => handleSort("status_akhir")}
                  >
                    Status Akhir
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingFetch ? (
                <TableRowSkeleton columns={7} />
              ) : searchLoading ? (
                <TableRowSkeleton columns={7} />
              ) : filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <p className="text-gray-500 text-sm mb-4">
                      Belum Ada data Justifikasi
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{row.student_name}</TableCell>
                      <TableCell>{row.class_name}</TableCell>
                      <TableCell>
                        {formatCreatedAt(row.waktu_absensi)}
                      </TableCell>
                      <TableCell>
                        <p className="inline-block text-red-700 font-semibold bg-red-100 px-2 py-1 rounded-md border-l-4 border-red-600">
                          {row.status_hadir}
                        </p>
                      </TableCell>
                      <TableCell className="text-gray-400 font-thin">
                        Belum Justifikasi
                      </TableCell>
                      <TableCell>
                        {isLoading === "editBtnJustifikasi" ? (
                          <div className="box-loader">
                            <div className="loader" />
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleEdit(row.id)}
                            className="flex gap-1 items-center cursor-pointer"
                          >
                            <i className="bx bx-edit text-[var(--primary-color)] text-lg"></i>
                            <p className="text-sm text-[var(--primary-color)]">
                              Justifikasi
                            </p>
                          </div>
                        )}
                      </TableCell>
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
      {!!Object?.keys(updateJustifikasi).length && (
        <ModalUpdateJustifikasi
          open={!!Object?.keys(updateJustifikasi).length}
          onClose={() => setUpdateJustifikasi({})}
          updateJustifikasi={updateJustifikasi}
          setUpdateJustifikasi={setUpdateJustifikasi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setToaster={setToaster}
          session={session}
          setData={setData}
          taTasem={tasem.ta}
        />
      )}
    </>
  );
};

export default DataTableJustifikasi;
