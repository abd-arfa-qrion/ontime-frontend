import Button from "@/components/ui/button";
import { Box, CircularProgress, Modal } from "@mui/material";
import React, { useState } from "react";

type Proptypes = {
  onClose: () => void;
};
const DownloadAbsensiModal = (props: Proptypes) => {
  const [isLoading, setIsLoading] = useState("");
  const { onClose } = props;
  return (
    <Modal
      open={true}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: 420,
          bgcolor: "#fff",
          borderRadius: 2,
          p: 3,
          mx: "auto",
          mt: "10%",
        }}
      >
        <h1 className="bg-green-200 text-center py-3 font-semibold border-y-1 border-[var(--primary-color)] mx-[-20px] mb-4">
          Download Laporan
        </h1>
        <form>
          {/* Tahun Ajaran */}

          {/* Nama Absensi */}

          <div className="flex gap-4 w-[70%] ml-auto mt-10">
            <Button
              type="button"
              className="[background:var(--gradient-secondary)] hover:[background:var(--secondary-dark)]"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading === "btnSubmitUmum"}
              className="[background:var(--gradient-primary)] hover:[background:var(--primary-color)]"
            >
              {isLoading === "btnSubmitUmum" ? (
                <CircularProgress size={20} />
              ) : (
                "Simpan"
              )}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default DownloadAbsensiModal;
