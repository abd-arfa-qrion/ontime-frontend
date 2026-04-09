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
import { millisToDateTime } from "@/utils/formatdate";
import DataTabelTagihanDetail from "../datatabeltrxdetail";
import { Transaksi, TransaksiDefault } from "@/type/Transaksi.type";
import { convertIDR } from "@/utils/curency";
import TxGagal from "../status/txgagal";
import TxSukses from "../status/txsukses";
import TableRowSkeleton from "../skeleton/tableRow";

type Proptype = {
  data: Transaksi[];
  setData: Dispatch<SetStateAction<Transaksi[]>>;
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  loadingFetch: boolean;
};
const DataTabelTrx = (prop: Proptype) => {
  const { data, setData, setToaster, session, loadingFetch } = prop;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredData, setFilteredData] = useState<Transaksi[]>(data);
  const [sortField, setSortField] = useState<keyof Transaksi | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openRowIndex, setOpenRowIndex] = useState<string | null>(null); // sebelumnya index: number
  const [loadingRowIndex, setLoadingRowIndex] = useState<string | null>(null);
  const [dataDetailTrx, setDataDetailTrx] =
    useState<Transaksi>(TransaksiDefault);
  const [isLoading, setIsLoading] = useState("");
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
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

  const handleSort = (field: keyof Transaksi) => {
    const isAsc = sortField === field && sortOrder === "asc";
    setSortField(field);
    setSortOrder(isAsc ? "desc" : "asc");
  };

  // const filteredData = data.filter((row) =>
  //   Object.values(row).some((value) =>
  //     value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  //   )
  // );
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);

    // kasih debounce kecil biar gak ke-trigger tiap ketik huruf
    const timer = setTimeout(() => {
      const result = data.filter((row) =>
        Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );

      setFilteredData(result);
      setSearchLoading(false);
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchQuery, data]);
  /// Perubahan sampai sini

  const sortedData = [...filteredData].sort((a, b) => {
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
    page * rowsPerPage + rowsPerPage
  );

  const toggleDetail = async (rowId: string) => {
    setIsLoading(`toggle-${rowId}`);

    if (loadingRowIndex === rowId) {
      setLoadingRowIndex(null);
      return null;
    } else {
      const selectedRow = data.find((row) => row.id === rowId); // gunakan key yang sesuai
      setOpenRowIndex((prev) => (prev === rowId ? null : rowId));
      setDataDetailTrx(selectedRow ?? TransaksiDefault);
      setLoadingRowIndex(null);
      console.log("rowId", rowId);

      setIsLoading("");
    }
  };

  return (
    <Paper className="px-2">
      {/* Field Search dengan Icon */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={handleSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "id"}
                  direction={sortField === "id" ? sortOrder : "asc"}
                  onClick={() => handleSort("id")}
                >
                  ID
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "tgl_inquiry"}
                  direction={sortField === "tgl_inquiry" ? sortOrder : "asc"}
                  onClick={() => handleSort("tgl_inquiry")}
                >
                  Tanggal Tagihan
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "tgl_transaksi"}
                  direction={sortField === "tgl_transaksi" ? sortOrder : "asc"}
                  onClick={() => handleSort("tgl_transaksi")}
                >
                  Tanggal Transaksi
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "kode_transaksi"}
                  direction={sortField === "kode_transaksi" ? sortOrder : "asc"}
                  onClick={() => handleSort("kode_transaksi")}
                >
                  Jenis
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "description"}
                  direction={sortField === "description" ? sortOrder : "asc"}
                  onClick={() => handleSort("description")}
                >
                  Keterangan
                </TableSortLabel>
              </TableCell>
              <TableCell>amount</TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "id_channel"}
                  direction={sortField === "id_channel" ? sortOrder : "asc"}
                  onClick={() => handleSort("id_channel")}
                >
                  Channel
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortField === "tx_status"}
                  direction={sortField === "tx_status" ? sortOrder : "asc"}
                  onClick={() => handleSort("tx_status")}
                >
                  Status
                </TableSortLabel>
              </TableCell>
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
                  <p className="text-gray-500 text-sm">Data tidak ditemukan</p>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color={openRowIndex === row.id ? "success" : "primary"}
                        size="small"
                        className="rounded-full p-2 min-w-0"
                        onClick={() => toggleDetail(row.id)} // row.id unik
                        disabled={isLoading === `toggle-${row.id}`}
                      >
                        {isLoading === `toggle-${row.id}` && (
                          <i className="bx bx-loader bx-spin"></i>
                        )}
                        {openRowIndex === row.id ? (
                          <i className="bx bx-minus"></i>
                        ) : (
                          <i className="bx bx-search-alt"></i>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      {row.tgl_inquiry === 0
                        ? "-"
                        : millisToDateTime(row.tgl_inquiry)}
                    </TableCell>
                    <TableCell>
                      {row.tgl_transaksi === 0
                        ? "-"
                        : millisToDateTime(row.tgl_transaksi)}
                    </TableCell>
                    <TableCell>
                      {row.kode_transaksi === "1" ? "Topup" : "Tagihan"}
                    </TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>
                      {}
                      <b>Rp.</b>
                      <b>{convertIDR(row.amount)}</b>
                    </TableCell>
                    <TableCell>
                      {row.id_channel === "6077" ? (
                        <i className="bx bx-qr text-lg">qris</i>
                      ) : row.id_channel === "6010" ? (
                        <i className="bx bxs-bank text-lg text-orange-400">
                          teller
                        </i>
                      ) : row.id_channel === "6017" ? (
                        <i className="bx bx-mobile text-lg text-purple-500">
                          mobile
                        </i>
                      ) : (
                        "BRKS"
                      )}
                    </TableCell>
                    <TableCell>
                      {row.tx_status === "00" || row.tx_status === "88" ? (
                        <TxSukses />
                      ) : (
                        <TxGagal />
                      )}
                    </TableCell>
                  </TableRow>
                  {openRowIndex === row.id && (
                    <tr>
                      <td colSpan={11} className="bg-green-50">
                        {loadingRowIndex === row.id ? (
                          // Skeleton loading saat data sedang dimuat
                          <div className="skeleton">
                            <p className="text-sm text-gray-500 width-full text-center">
                              sedang memuat data ...
                            </p>
                          </div>
                        ) : (
                          // Tampilkan data detail setelah selesai
                          <div className="bg-white rounded-lg w-full shadow-md p-2">
                            <DataTabelTagihanDetail
                              data={dataDetailTrx}
                              setData={setDataDetailTrx}
                              setToaster={setToaster}
                              session={session}
                            />
                          </div>
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
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Paper>
  );
};

export default DataTabelTrx;
