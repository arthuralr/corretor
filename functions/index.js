
const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {initializeApp} = require("firebase-admin/app");
const {getStorage} = require("firebase-admin/storage");
const cors = require("cors")({
    origin: [
        "https://6000-firebase-studio-1753713394221.cluster-4xpux6pqdzhrktbhjf2cumyqtg.cloudworkstations.dev",
        "http://localhost:3000",
        "http://localhost:9002"
    ]
});
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

initializeApp();

exports.uploadImage = onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Method Not Allowed",
        message: "Only POST requests are accepted.",
      });
    }

    const busboy = Busboy({headers: req.headers});
    const tmpdir = os.tmpdir();

    const fileWrites = [];
    const fields = {};

    busboy.on("field", (fieldname, val) => {
      fields[fieldname] = val;
    });

    busboy.on("file", (fieldname, file, filename) => {
      const {mimeType} = filename;
      const filepath = path.join(tmpdir, filename.filename);
      const writeStream = fs.createWriteStream(filepath);
      file.pipe(writeStream);

      const promise = new Promise((resolve, reject) => {
        file.on("end", () => {
          writeStream.end();
        });
        writeStream.on("finish", () => {
          resolve({filepath, fieldname, mimeType});
        });
        writeStream.on("error", reject);
      });
      fileWrites.push(promise);
    });

    busboy.on("finish", async () => {
        try {
            const [fileData] = await Promise.all(fileWrites);
            if (!fileData) {
                res.status(400).json({ success: false, error: "No file uploaded." });
                return;
            }

            const { filepath, fieldname, mimeType } = fileData;
            const originalFilename = path.basename(filepath);
            const uniqueFilename = `${Date.now()}-${originalFilename}`;

            const bucket = getStorage().bucket();
            const [uploadedFile] = await bucket.upload(filepath, {
                destination: `imoveis/${uniqueFilename}`,
                metadata: {
                    contentType: mimeType,
                },
            });
            
            await uploadedFile.makePublic();
            
            res.status(200).json({
                success: true,
                url: uploadedFile.publicUrl(),
            });

        } catch (error) {
            logger.error("Error during image upload:", error);
            res.status(500).json({ success: false, error: "Failed to upload image." });
        }
    });

    busboy.end(req.rawBody);
  });
});
