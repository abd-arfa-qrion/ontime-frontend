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

import { DeleteForever, RefreshRounded } from "@mui/icons-material";
import EditBtn from "@/components/ui/button/edit";
import { Kaldik, KaldikDefault } from "@/type/Kaldik.type";
import { formatCreatedAt } from "@/utils/formatdate";
import ModalUpdateKaldik from "@/components/view/admin/Akademik/ModalUpdateData";
type Proptype = {
  data: Kaldik[];
  setData: Dispatch<SetStateAction<Kaldik[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
};
const DataTableKaldik = (prop: Proptype) => {
  const { data, setData, setToaster, setLoadingFetch, session, loadingFetch } =
    prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Kaldik[]>(data);
  const [sortField, setSortField] = useState<keyof Kaldik | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<string>(""); // sebelumnya index: number
  const [editingData, setEditingData] = useState<Kaldik>(KaldikDefault);

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

  const handleSort = (field: keyof Kaldik) => {
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
    setIsLoading("editKaldikBtn");

    const editingData = data.find((item) => item.id === id);
    console.log("menampilkan data: ", editingData);
    setEditingData(editingData ?? KaldikDefault);
    setModalUpdate(true);
    setIsLoading("");
  };
  return (
    <>
      <Paper className="px-2 pt-2">
        <div className="flex items-center justify-between">
          {/* KIRI */}
          <h4 className="judul-tabel font-semibold text-md md:text-lg text-gray-800 whitespace-nowrap">
            Kalender Akademik tahun Ajaran {session?.data?.tahunAjaran}
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
                    active={sortField === "keterangan"}
                    direction={sortField === "keterangan" ? sortOrder : "asc"}
                    onClick={() => handleSort("keterangan")}
                  >
                    Nama Kegiatan
                  </TableSortLabel>
                </TableCell>

                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "tgl_awal"}
                    direction={sortField === "tgl_awal" ? sortOrder : "asc"}
                    onClick={() => handleSort("tgl_awal")}
                  >
                    Tanggal Kegiatan
                  </TableSortLabel>
                </TableCell>
                <TableCell className="font-[550]">
                  <TableSortLabel
                    active={sortField === "label"}
                    direction={sortField === "label" ? sortOrder : "asc"}
                    onClick={() => handleSort("label")}
                  >
                    Label
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
                      Belum ada data kalender akademik
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <React.Fragment key={index}>
                    <TableRow>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>

                      <TableCell>{row.keterangan}</TableCell>
                      <TableCell>
                        {formatCreatedAt(row.tgl_awal)}
                        {formatCreatedAt(row.tgl_akhir) ===
                        formatCreatedAt(row.tgl_awal)
                          ? ""
                          : ` - ${formatCreatedAt(row.tgl_akhir)}`}
                      </TableCell>
                      <TableCell>
                        <span
                          style={{ backgroundColor: row.label }}
                          className={`border rounded background-[${row.label}] p-1 text-white text-xs`}
                        >
                          {row.label}
                        </span>
                      </TableCell>
                      <TableCell>{row.start_time}</TableCell>
                      <TableCell>{row.end_time}</TableCell>
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
          rowsPerPageOptions={[5, 10, 25]}
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
      {modalUpdate && (
        <ModalUpdateKaldik
          open={modalUpdate}
          onClose={() => setModalUpdate(false)}
          setToaster={setToaster}
          editingData={editingData}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setData={setData}
          setModalUpdate={setModalUpdate}
        />
      )}
    </>
  );
};

export default DataTableKaldik;
