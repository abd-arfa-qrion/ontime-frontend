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
  Skeleton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "../../../skeleton/tableRow";
import {
  JadwalAkademik,
  JadwalAkademikDefault,
} from "@/type/Jadwalakademik.type";

import CustomizedSwitches from "../../swithbutton";
import FilterKelas from "../../filterkelas";
import { Kelas } from "@/type/Kelas.type";
import CalendarView from "../../calendarview";
import EditBtn from "@/components/ui/button/edit";
import ModalUpdateAbsensiAkademik from "@/components/view/admin/Absensi/ModalUpdateAbsensiAkademik";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
type Proptype = {
  data: JadwalAkademik[];
  setData: Dispatch<SetStateAction<JadwalAkademik[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddAbsensi: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
  kelasData: Kelas[];
};
const DataTabelJadwalAkademik = (prop: Proptype) => {
  const {
    data,
    setData,
    setToaster,
    session,
    loadingFetch,
    setAddAbsensi,
    kelasData,
  } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<JadwalAkademik[]>(data);
  const [sortField, setSortField] = useState<keyof JadwalAkademik | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openRowIndex, setOpenRowIndex] = useState<string | null>(null); // sebelumnya index: number
  const [loadingRowIndex, setLoadingRowIndex] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<string>("");

  //modal
  const [updateJadwal, setUpdateJadwal] = useState<JadwalAkademik | {}>({});
  //handle tombol switch list | calendar
  const [switchBtn, setSwitchBtn] = useState<string>("list");

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

  const handleSort = (field: keyof JadwalAkademik) => {
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

  const handleFilterbyKelas = (kelas: number | null) => {
    if (kelas !== null) {
      const result = data.filter((item) => item.kelas_id === kelas);
      setFilteredData(result);
    } else {
      setFilteredData(data);
    }
  };

  const handleEdit = async (id: number) => {
    setIsLoading("editBtn");

    const editingData = data.find((item) => item.id === id);
    console.log("menampilkan data: ", editingData);
    setUpdateJadwal(editingData ?? {});
    setIsLoading("");
  };

  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Absensi Mata Pelajaran Tahun Ajaran {tasem.ta}
          </h4>

          {/* KANAN */}
          <div className="flex items-center gap-2">
            <CustomizedSwitches
              switchBtn={switchBtn}
              setSwitchBtn={setSwitchBtn}
            />

            <Button
              onClick={() => setAddAbsensi(true)}
              variant="contained"
              style={{
                backgroundColor: "var(--primary-color)",
                fontSize: "10px",
                padding: "8px 20px",
              }}
              size="medium"
              className="rounded-[10px]"
            >
              Tambah Absen +
            </Button>

            <FilterKelas
              kelasData={kelasData}
              handleFilterbyKelas={handleFilterbyKelas}
              switchBtn={switchBtn}
            />

            {switchBtn === "list" && (
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
            )}
          </div>
        </div>
        {/* Field Search dengan Icon */}
        {switchBtn === "list" ? (
          <>
            <TableContainer className="mt-5">
              <Table>
                <TableHead className="bg-green-100">
                  <TableRow>
                    <TableCell className="font-[550]">No</TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "hari"}
                        direction={sortField === "hari" ? sortOrder : "asc"}
                        onClick={() => handleSort("hari")}
                      >
                        Hari
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "kelas_name"}
                        direction={
                          sortField === "kelas_name" ? sortOrder : "asc"
                        }
                        onClick={() => handleSort("kelas_name")}
                      >
                        Kelas
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "mapel_name"}
                        direction={
                          sortField === "mapel_name" ? sortOrder : "asc"
                        }
                        onClick={() => handleSort("mapel_name")}
                      >
                        Mata Pelajaran
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "guru_name"}
                        direction={
                          sortField === "guru_name" ? sortOrder : "asc"
                        }
                        onClick={() => handleSort("guru_name")}
                      >
                        Guru
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "start_time"}
                        direction={
                          sortField === "start_time" ? sortOrder : "asc"
                        }
                        onClick={() => handleSort("start_time")}
                      >
                        Jam Mulai
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">
                      <TableSortLabel
                        active={sortField === "end_time"}
                        direction={sortField === "end_time" ? sortOrder : "asc"}
                        onClick={() => handleSort("end_time")}
                      >
                        Jam Selesai
                      </TableSortLabel>
                    </TableCell>
                    <TableCell className="font-[550]">Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingFetch ? (
                    <TableRowSkeleton columns={9} />
                  ) : searchLoading ? (
                    <TableRowSkeleton columns={9} />
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        <p className="text-gray-500 text-sm">
                          Data tidak ditemukan
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row, index) => (
                      <React.Fragment key={index}>
                        <TableRow>
                          <TableCell>
                            {page * rowsPerPage + index + 1}
                          </TableCell>

                          <TableCell>{row.hari}</TableCell>
                          <TableCell>{row.kelas_name}</TableCell>
                          <TableCell>{row.mapel_name}</TableCell>
                          <TableCell>{row.guru_name}</TableCell>
                          <TableCell>
                            {row.start_time.substring(0, 5)} Wib
                          </TableCell>
                          <TableCell>
                            {row.end_time.substring(0, 5)} Wib
                          </TableCell>
                          <TableCell>
                            <EditBtn onClick={() => handleEdit(row.id)} />
                          </TableCell>
                        </TableRow>

                        {openRowIndex === String(row.id) && (
                          <tr>
                            <td colSpan={11} className="bg-green-50">
                              {loadingRowIndex === String(row.id) ? (
                                // Skeleton loading saat data sedang dimuat
                                <div className="skeleton">
                                  <p className="text-sm text-gray-500 width-full text-center">
                                    sedang memuat data ...
                                  </p>
                                </div>
                              ) : (
                                // Tampilkan data detail setelah selesai
                                <div className="bg-white rounded-lg w-full shadow-md p-2"></div>
                              )}
                            </td>
                          </tr>
                        )}
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
          </>
        ) : (
          <div className="mt-5 pb-5">
            <CalendarView data={data} />
          </div>
        )}
      </Paper>
      {!!Object?.keys(updateJadwal).length && (
        <ModalUpdateAbsensiAkademik
          open={!!Object?.keys(updateJadwal).length}
          onClose={() => setUpdateJadwal({})}
          updateJadwal={updateJadwal}
          setUpdateJadwal={setUpdateJadwal}
          setData={setData}
          kelasData={kelasData}
          setToaster={setToaster}
          session={session}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
};

export default DataTabelJadwalAkademik;
