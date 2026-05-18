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
import { JustifikasiGuru } from "@/type/Justifikasi.type";
import ModalUpdateJustifikasiGuru from "@/components/view/admin/Justifikasi/ModalUpdateGuru";
type Proptype = {
  dataGuru: JustifikasiGuru[];
  setDataGuru: Dispatch<SetStateAction<JustifikasiGuru[]>>;
  session: any;
  loadingFetch: boolean;
  setToaster: Dispatch<SetStateAction<{}>>;
  setTabActive: Dispatch<SetStateAction<string>>;
};
const DataTableJustifikasiGuru = (prop: Proptype) => {
  const {
    dataGuru,
    setDataGuru,
    session,
    loadingFetch,
    setToaster,
    setTabActive,
  } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<JustifikasiGuru[]>(
    dataGuru ?? [],
  );
  const [sortField, setSortField] = useState<keyof JustifikasiGuru | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [isLoading, setIsLoading] = useState<string>("");

  const [updateJustifikasi, setUpdateJustifikasi] =
    useState<JustifikasiGuru | null>(null);

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

  const handleSort = (field: keyof JustifikasiGuru) => {
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
  const handleEdit = (row: JustifikasiGuru) => {
    setIsLoading("editBtnJustifikasiGuru");

    setUpdateJustifikasi({ ...row });

    setTimeout(() => {
      setIsLoading("");
    }, 150);
  };

  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Justifikasi Absensi Guru Tahun Ajaran {tasem.ta}
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
                    active={sortField === "teacher_name"}
                    direction={sortField === "teacher_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("teacher_name")}
                  >
                    Nama Guru
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "mapel_name"}
                    direction={sortField === "mapel_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("mapel_name")}
                  >
                    Mata Ajaran
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
              ) : (filteredData ?? []).length === 0 ? (
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

                      <TableCell>{row.teacher_name}</TableCell>
                      <TableCell>{row.mapel_name}</TableCell>
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
                        {isLoading === "editBtnJustifikasiGuru" ? (
                          <div className="box-loader">
                            <div className="loader" />
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <div
                            onClick={() => handleEdit(row)}
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
      {updateJustifikasi && (
        <ModalUpdateJustifikasiGuru
          open={!!updateJustifikasi}
          onClose={() => setUpdateJustifikasi(null)}
          updateJustifikasi={updateJustifikasi}
          setUpdateJustifikasi={setUpdateJustifikasi}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setToaster={setToaster}
          session={session}
          setDataGuru={setDataGuru}
          taTasem={tasem.ta}
          setTabActive={setTabActive}
        />
      )}
    </>
  );
};

export default DataTableJustifikasiGuru;
