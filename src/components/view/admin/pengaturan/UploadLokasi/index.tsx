import { useState, ChangeEvent, Dispatch, SetStateAction } from "react";
import styles from "./UploadLokasi.module.scss";
import { Button } from "@mui/material";
import SetAreaServices from "@/pages/api/services/setarea";
import { InstitutionArea } from "@/type/Institutionarea.type";

type Props = {
  setToaster: Dispatch<SetStateAction<{}>>;
  session: any;
  dataArea: InstitutionArea;
  setDataArea: Dispatch<SetStateAction<InstitutionArea>>;
};
const UploadLokasiPageView = (prop: Props) => {
  const { setToaster, session, dataArea, setDataArea } = prop;

  const [eFile, setEFile] = useState<any>(null);
  const [typeError, setTypeError] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const [formHover, setFormHover] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormHover = () => {
    if (formHover) {
      setFormHover(false);
      return;
    } else {
      setFormHover(true);
    }
  };
  const handlePilihFile = () => {
    const fileInput: HTMLInputElement = document.getElementById(
      "file-input",
    ) as HTMLInputElement;
    fileInput.click();
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target?.files) {
      const fileType = ["application/vnd.google-earth.kml+xml"];
      const selectedFile = e.target.files[0];

      if (selectedFile) {
        if (fileType.includes(selectedFile.type)) {
          setTypeError("");
          setFileName(selectedFile.name);

          // ✅ SIMPAN FILE LANGSUNG
          setEFile(selectedFile);
        } else {
          setTypeError("File harus berekstensi .kml");
          setEFile(null);
        }
      }
    }
  };

  const handleSubmit = async (e: any) => {
    setIsLoading(true);
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    if (eFile !== null) {
      if (dataArea.id !== 0) {
        const formData = new FormData();
        if (session.data?.user?.instansiId) {
          formData.append("inst", String(session.data.user.instansiId));
        }
        formData.append("kml", eFile);
        formData.append("id", dataArea.id.toString());

        try {
          const res = await SetAreaServices.updateArea(
            formData,
            session.data?.accessToken,
          );
          if (res.status !== 200 || res.data.status_code !== 200) {
            setToaster({
              variant: "danger",
              message: res.data.message,
            });
          }
          form.reset();
          setEFile(null);
          setFileName("");
          setToaster({
            variant: "success",
            message: res.data.message,
          });
          const data = {
            inst: session.data?.user?.instansiId,
          };
          const req = await SetAreaServices.getDataArea(
            data,
            session.data?.accessToken,
          );
          setDataArea(req.data.data);
          // (
        } catch (error) {
          setToaster({
            variant: "danger",
            message: "Terjadi kesalahan",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        const formData = new FormData();
        if (session.data?.user?.instansiId) {
          formData.append("inst", String(session.data.user.instansiId));
        }
        formData.append("kml", eFile);

        try {
          const res = await SetAreaServices.uploadKml(
            formData,
            session.data?.accessToken,
          );
          if (res.status !== 200 || res.data.status_code !== 200) {
            setToaster({
              variant: "danger",
              message: res.data.message,
            });
          }
          form.reset();
          setEFile(null);
          setFileName("");
          setToaster({
            variant: "success",
            message: res.data.message,
          });
          const data = {
            inst: session.data?.user?.instansiId,
          };
          const req = await SetAreaServices.getDataArea(
            data,
            session.data?.accessToken,
          );
          setDataArea(req.data.data);
          // (
        } catch (error) {
          setToaster({
            variant: "danger",
            message: "Terjadi kesalahan",
          });
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl">Upload File Lokasi Poligon Map</h2>

      <form onSubmit={handleSubmit}>
        <div className={styles.enkrip}>
          <input
            className={styles.enkrip__input}
            type="file"
            accept=".kml"
            onChange={handleFileChange}
            id="file-input"
          />
          <label
            onClick={handlePilihFile}
            onMouseEnter={handleFormHover}
            onMouseLeave={handleFormHover}
            className={
              formHover ? styles.enkrip__labelhover : styles.enkrip__label
            }
            id="custom-file-input"
          >
            <i
              className={`bx bxs-file-import ${eFile ? "text-green-700" : ""}`}
            ></i>
            <p>{fileName ? fileName : "Pilih File Poligon Map"}</p>
          </label>
          <Button
            className={styles.enkrip__btn}
            variant="contained"
            color="success"
            type="submit"
            disabled={isLoading || eFile === null}
          >
            {isLoading ? (
              <div className="box-loader">
                <div className="loader" />
                <p>Processing...</p>
              </div>
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </form>
      {typeError && <p className={styles.error}>{typeError}</p>}
    </div>
  );
};

export default UploadLokasiPageView;
