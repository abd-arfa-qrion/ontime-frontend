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

import { DeleteForever, RefreshRounded } from "@mui/icons-material";
import EditBtn from "@/components/ui/button/edit";
import { Kaldik, KaldikDefault } from "@/type/Kaldik.type";
import { formatCreatedAt } from "@/utils/formatdate";
import ModalUpdateKaldik from "@/components/view/admin/Akademik/ModalUpdateData";
import {
  LapAbsensiMasukGuru,
  LapAbsensiMasukGuruDefault,
} from "@/type/Laporan.type";
type Proptype = {
  data: LapAbsensiMasukGuru[];
  setData: Dispatch<SetStateAction<LapAbsensiMasukGuru[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
  filterTA: string;
};
const DataTableLapMasukPulangGuru = (prop: Proptype) => {
  const {
    data,
    setData,
    setToaster,
    setLoadingFetch,
    session,
    loadingFetch,
    filterTA,
  } = prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<LapAbsensiMasukGuru[]>(data);
  const [sortField, setSortField] = useState<keyof LapAbsensiMasukGuru | null>(
    null,
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<string>(""); // sebelumnya index: number
  const [editingData, setEditingData] = useState<LapAbsensiMasukGuru>(
    LapAbsensiMasukGuruDefault,
  );

  //handle Modal
  const [modalUpdate, setModalUpdate] = useState<boolean>(false);
  const [modalDelete, setModalDelete] = useState<boolean>(false);
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

  const handleSort = (field: keyof LapAbsensiMasukGuru) => {
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

  const handleEdit = async (id: string) => {
    setIsLoading("editKaldikBtn");

    const editingData = data.find((item) => item.id === id);
    console.log("menampilkan data: ", editingData);
    setEditingData(editingData ?? LapAbsensiMasukGuruDefault);
    setModalUpdate(true);
    setIsLoading("");
  };
  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Laporan Absensi Masuk & Pulang Guru {filterTA}
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
                    active={sortField === "guru_name"}
                    direction={sortField === "guru_name" ? sortOrder : "asc"}
                    onClick={() => handleSort("guru_name")}
                  >
                    Nama Guru
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "guru_nip"}
                    direction={sortField === "guru_nip" ? sortOrder : "asc"}
                    onClick={() => handleSort("guru_nip")}
                  >
                    NIP
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "tanggal"}
                    direction={sortField === "tanggal" ? sortOrder : "asc"}
                    onClick={() => handleSort("tanggal")}
                  >
                    Tanggal
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "checkin_time"}
                    direction={sortField === "checkin_time" ? sortOrder : "asc"}
                    onClick={() => handleSort("checkin_time")}
                  >
                    Jam Masuk
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "checkout_time"}
                    direction={
                      sortField === "checkout_time" ? sortOrder : "asc"
                    }
                    onClick={() => handleSort("checkout_time")}
                  >
                    Jam Pulang
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "status_hadir"}
                    direction={sortField === "status_hadir" ? sortOrder : "asc"}
                    onClick={() => handleSort("status_hadir")}
                  >
                    Status
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
                      Belum ada absensi
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{row.guru_name}</TableCell>
                      <TableCell>{row.guru_nip}</TableCell>
                      <TableCell>{formatCreatedAt(row.tanggal)}</TableCell>
                      <TableCell>
                        {new Date(row.checkin_time).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(row.checkout_time).toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </TableCell>
                      <TableCell>
                        <p
                          className={`inline-block font-semibold px-2 py-1 rounded-md border-l-4 ${row.status_hadir === "hadir" ? "text-green-700 bg-green-100 border-green-600 " : row.status_hadir === "izin" ? "text-yellow-700 bg-yellow-100 border-yellow-600" : row.status_hadir === "alpa" ? "text-red-700 bg-red-100 border-red-600" : "bg-orange-100 text-orange-700 border-orange-600"}`}
                        >
                          {row.status_hadir}
                        </p>
                      </TableCell>
                      <TableCell className="flex gap-1 items-center">
                        {isLoading === "editBtn" ? (
                          <div className="box-loader">
                            <div className="loader" />
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <EditBtn onClick={() => handleEdit(row.id)} />
                        )}
                        {isLoading === "deleteBtn" ? (
                          <div className="box-loader">
                            <div className="loader" />
                            <p>Loading...</p>
                          </div>
                        ) : (
                          <DeleteForever
                            sx={{ color: "#ae0c0c", cursor: "pointer" }}
                          />
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
      {modalUpdate && <div>Modal add disini</div>}
    </>
  );
};

export default DataTableLapMasukPulangGuru;
