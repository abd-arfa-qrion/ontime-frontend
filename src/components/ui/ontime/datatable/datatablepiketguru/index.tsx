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
import EditBtn from "@/components/ui/button/edit";
import { PiketGuru } from "@/type/Piketguru.type";
import ModalUpdatePiket from "@/components/view/admin/Piketguru/ModalUpdate";
type Proptype = {
  data: PiketGuru[];
  setData: Dispatch<SetStateAction<PiketGuru[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  setLoadingFetch: Dispatch<SetStateAction<boolean>>;
  session: any;
  loadingFetch: boolean;
};
const DataTablePiketGuru = (prop: Proptype) => {
  const { data, setData, setToaster, setLoadingFetch, session, loadingFetch } =
    prop;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<PiketGuru[]>(data);
  const [sortField, setSortField] = useState<keyof PiketGuru | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState<string>(""); // sebelumnya index: number
  const [editingData, setEditingData] = useState<PiketGuru | null>(null);
  //handle Modal
  const [modalGenerate, setModalGenerate] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
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

  const handleSort = (field: keyof PiketGuru) => {
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
            Absensi Mata Pelajaran Tahun Ajaran
          </h4>

          {/* KANAN */}
          <Link
            href="/admin/absensi?tab=masuk"
            className="text-sm flex items-center gap-1 justify-center no-underline hover:text-blue-800"
          >
            <i className="bx bx-arrow-back text-lg mr-1"></i>
            Kembali ke Halaman Absensi
          </Link>
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
                    active={sortField === "guru_nip"}
                    direction={sortField === "guru_nip" ? sortOrder : "asc"}
                    onClick={() => handleSort("guru_nip")}
                  >
                    NIP
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
                    <p className="text-gray-500 text-sm mb-4">
                      Data Piket belum terbentuk. Silahkan generate Jadwal
                      Absensi Masuk dan Pulang telebih dahulu
                    </p>

                    <Link href="/admin/absensi?tab=masuk">
                      <Button
                        variant="contained"
                        sx={{
                          py: 1,
                          background: "var(--primary-color)", // Ganti dengan warna yang diinginkan (misalnya "var(--primary)",
                          textTransform: "none",
                          "&:hover": {
                            background: "var(--primary-color)",
                            filter: "brightness(1.05)",
                          },
                        }}
                      >
                        di sini
                      </Button>
                    </Link>
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
                          <p className="text-red-500">belum diatur</p>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.guru_nip ? (
                          row.guru_nip
                        ) : (
                          <p className="text-red-500">belum diatur</p>
                        )}
                      </TableCell>

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
      {modalUpdate && (
        <ModalUpdatePiket
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

export default DataTablePiketGuru;
