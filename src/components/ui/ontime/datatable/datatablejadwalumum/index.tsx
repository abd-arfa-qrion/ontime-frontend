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

import { Kelas } from "@/type/Kelas.type";
import {
  JadwalUmum,
  MethodeAbsensi,
  TargetAbsensi,
} from "@/type/Jadwalumum.type";
import {
  BorderColor,
  Edit,
  EditNote,
  EditNoteOutlined,
} from "@mui/icons-material";
import EditBtn from "@/components/ui/button/edit";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import ModalUpdateAbsensiUmum from "@/components/view/admin/Absensi/ModalUpdateAbsensiUmum";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";

type Proptype = {
  data: JadwalUmum[];
  setData: Dispatch<SetStateAction<JadwalUmum[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setAddAbsensiUmum: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
  kelasData: Kelas[];
};
const DataTabelJadwalUmum = (prop: Proptype) => {
  const {
    data,
    setData,
    setToaster,
    session,
    loadingFetch,
    setAddAbsensiUmum,
    kelasData,
  } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<JadwalUmum[]>(data);
  const [sortField, setSortField] = useState<keyof JadwalUmum | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openRowIndex, setOpenRowIndex] = useState<string | null>(null); // sebelumnya index: number
  const [loadingRowIndex, setLoadingRowIndex] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<string>("");

  //modal
  const [updateJadwal, setUpdateJadwal] = useState<JadwalMasuk | {}>({});
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

  const handleSort = (field: keyof JadwalUmum) => {
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
    setIsLoading("ediUmumBtn");

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
            Absensi Umum Tahun Ajaran {tasem.ta}
          </h4>

          {/* KANAN */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setAddAbsensiUmum(true)}
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
                    active={sortField === "absensi_name"}
                    direction={sortField === "absensi_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("absensi_name")}
                  >
                    Nama Absen
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "tgl_mulai"}
                    direction={sortField === "tgl_selesai" ? sortOrder : "asc"}
                    onClick={() => handleSort("tgl_selesai")}
                  >
                    Periode Absen
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "start_time"}
                    direction={sortField === "start_time" ? sortOrder : "asc"}
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
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "methodes_absensi"}
                    direction={
                      sortField === "methodes_absensi" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("methodes_absensi")}
                  >
                    Metode
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "targets_absensi"}
                    direction={
                      sortField === "targets_absensi" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("targets_absensi")}
                  >
                    Target
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
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{row.absensi_name}</TableCell>
                      <TableCell>
                        {row.tgl_mulai
                          ? new Date(row.tgl_mulai).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "-"}
                        {" - "}
                        {row.tgl_selesai
                          ? new Date(row.tgl_selesai).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              },
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {row.start_time.substring(0, 5)} Wib
                      </TableCell>
                      <TableCell>{row.end_time.substring(0, 5)} Wib</TableCell>
                      <TableCell>
                        {row.methodes_absensi
                          .map((target: MethodeAbsensi) => target.name)
                          .join(", ")}
                      </TableCell>
                      <TableCell>
                        {row.targets_absensi
                          .map((target: TargetAbsensi) => target.name)
                          .join(", ")}
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
      </Paper>
      {!!Object?.keys(updateJadwal).length && (
        <ModalUpdateAbsensiUmum
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

export default DataTabelJadwalUmum;
