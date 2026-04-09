import React from "react";
import { TableRow, TableCell, Skeleton } from "@mui/material";

type TableRowSkeletonProps = {
  columns: number;
  rowCount?: number;
};

const TableRowSkeleton: React.FC<TableRowSkeletonProps> = ({
  columns,
  rowCount = 5,
}) => {
  return (
    <>
      {[...Array(rowCount)].map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {[...Array(columns)].map((_, colIndex) => (
            <TableCell key={colIndex}>
              <Skeleton variant="text" animation="wave" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableRowSkeleton;
