const fs = require("fs");

const deleteFile = (filePath) => {
  console.log("Attempting to delete file:", filePath); // Debug log
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
    } else {
      console.log("File deleted successfully:", filePath);
    }
  });
};

exports.deleteFile = deleteFile;
