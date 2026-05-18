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
  Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TableRowSkeleton from "../../../skeleton/tableRow";

import { RefreshRounded } from "@mui/icons-material";
import { JadwalMasuk } from "@/type/Jadwalmasuk.type";
import jadwalMasukServices from "@/pages/api/services/jadwalmasuk";
import EditBtn from "@/components/ui/button/edit";
import ModalGenerate from "@/components/view/admin/Absensi/ModalGenerate";
import ModalUpdateAbsensiMasuk from "@/components/view/admin/Absensi/ModalUpdateAbsensiMasuk";
import { getTahunAjaranWithSemester } from "@/utils/tasemester";
type Proptype = {
  data: JadwalMasuk[];
  setData: Dispatch<SetStateAction<JadwalMasuk[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
};
const DataTabelJadwalMasuk = (prop: Proptype) => {
  const { data, setData, setToaster, setLoadingFetch, session, loadingFetch } =
    prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<JadwalMasuk[]>(data);
  const [sortField, setSortField] = useState<keyof JadwalMasuk | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<string>(""); // sebelumnya index: number
  const [editingData, setEditingData] = useState<JadwalMasuk | null>(null);

  //handle Modal
  const [modalGenerate, setModalGenerate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);

  //baca tahun ajaran saat ini
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

  const handleSort = (field: keyof JadwalMasuk) => {
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

  const handleGenerate = async (data: any) => {
    setLoadingFetch(true);
    try {
      const res = await jadwalMasukServices.GenerateData(
        data,
        session.data?.accessToken,
      );

      if (res.status !== 200 || res.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: res.data.message,
        });
        return;
      }

      const payloadList = {
        inst: session.data?.user?.instansiId,
        tahunajaran: tasem.ta,
      };

      const req = await jadwalMasukServices.getAllData(
        payloadList,
        session.data?.accessToken,
      );

      if (req.status !== 200 || req.data.status_code !== 200) {
        setToaster({
          variant: "danger",
          message: req.data.message,
        });
        return;
      }

      setData(req.data.data);
      setModalGenerate(false);
    } catch (error) {
      setToaster({
        variant: "danger",
        message: "Terjadi kesalahan",
      });
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleEdit = async (id: number) => {
    setIsLoading("editBtn");

    const editingData = data.find((item) => item.id === id);
    console.log("menampilkan data: ", editingData);
    setEditingData(editingData ?? null);
    setModalUpdate(true);
    setIsLoading("");
  };

  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Absensi Mata & Pulang Sekolah Tahun Ajaran {tasem.ta}
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
                    active={sortField === "hari"}
                    direction={sortField === "hari" ? sortOrder : "asc"}
                    onClick={() => handleSort("hari")}
                  >
                    Hari
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "guru_name"}
                    direction={sortField === "guru_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("guru_name")}
                  >
                    Guru
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "start_time"}
                    direction={sortField === "start_time" ? sortOrder : "asc"}
                    onClick={() => handleSort("start_time")}
                  >
                    Jam Masuk
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "end_time"}
                    direction={sortField === "end_time" ? sortOrder : "asc"}
                    onClick={() => handleSort("end_time")}
                  >
                    Jam Pulang
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "toleransi_time"}
                    direction={
                      sortField === "toleransi_time" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("toleransi_time")}
                  >
                    Toleransi
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
                      Data tidak ditemukan
                    </p>

                    <Button
                      variant="contained"
                      sx={{
                        py: 1,
                        background: "var(--gradient-primary)",
                        textTransform: "none",
                        "&:hover": {
                          background: "var(--gradient-primary)",
                          filter: "brightness(1.05)",
                        },
                      }}
                      type="submit"
                      onClick={() => setModalGenerate(true)}
                    >
                      <RefreshRounded className="mr-2" />
                      Add Jadwal Masuk & Pulang
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{row.hari}</TableCell>
                      <TableCell>
                        {row.guru_name ? (
                          row.guru_name
                        ) : (
                          <Link href="/admin/piketguru">
                            <a>Atur Guru Piket</a>
                          </Link>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.start_time.substring(0, 5)} Wib
                      </TableCell>
                      <TableCell>{row.end_time.substring(0, 5)} Wib</TableCell>
                      <TableCell>{row.toleransi_time} Menit</TableCell>
                      <TableCell>
                        {isLoading === "editBtn" ? (
                          <div className="box-loader">
                            <div className="loader" />
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <EditBtn onClick={() => handleEdit(row.id)} />
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
      {modalGenerate && (
        <ModalGenerate
          open={modalGenerate}
          onClose={() => setModalGenerate(false)}
          setToaster={setToaster}
          session={session}
          handleGenerate={handleGenerate}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      )}
      {modalUpdate && (
        <ModalUpdateAbsensiMasuk
          open={modalUpdate}
          onClose={() => setModalUpdate(false)}
          setToaster={setToaster}
          editingData={editingData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          session={session}
          setData={setData}
        />
      )}
    </>
  );
};

export default DataTabelJadwalMasuk;
