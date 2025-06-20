import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Modal, Table, App } from "antd";

const { Dragger } = Upload;

interface IProps {
  openUpload: boolean;
  setOpenUpload: (v: boolean) => void;
}
interface IDataImport {
  fullName: string;
  email: string;
  phone: string;
}

const UploadFile = ({ openUpload, setOpenUpload }: IProps) => {
  const [dataImport, setDataImport] = useState<IDataImport[]>([]);
  const { message } = App.useApp();
  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    action:
      ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        if (onSuccess) onSuccess("ok");
      }, 1000);
    },
    async onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        if (info.fileList && info.fileList.length > 0) {
          const file = info.fileList[0].originFileObj!;
          // load file
          const workbook = new Exceljs.Workbook();
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          await workbook.xlsx.load(buffer);
          let jsonData = [];
          workbook.worksheets.forEach(function (sheet) {
            // read first row as data keys
            let firstRow = sheet.getRow(1);
            if (!firstRow.cellCount) return;
            let keys = firstRow.values;
            sheet.eachRow((row, rowNumber) => {
              if (rowNumber == 1) return;
              let values = row.values;
              let obj = {};
              for (let i = 1; i < keys.length; i++) {
                obj[keys[i]] = values[i];
              }
              jsonData.push(obj);
            });
          });
          setDataImport(jsonData);
        }
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  return (
    <Modal
      title="Upload File"
      open={openUpload}
      onCancel={() => setOpenUpload(false)}
      footer={null}
    >
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      <div style={{ paddingTop: 20 }}>
        <Table
          title={() => <span>Du lieu upload</span>}
          columns={[
            { dataIndex: "fullName", title: "FUll Name" },
            { dataIndex: "email", title: "email" },
            { dataIndex: "phone", title: "Phonenumber" },
          ]}
        />
      </div>
    </Modal>
  );
};

export default UploadFile;
