// --- IMPORTAÇÕES GERAIS ---
const {onRequest} = require("firebase-functions/v2/https");
const {onSchedule} = require("firebase-functions/v2/scheduler");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");
const {js2xml} = require("xml-js");
const cors = require("cors")({
    origin: [
        "https://6000-firebase-studio-1753713394221.cluster-4xpux6pqdzhrktbhjf2cumyqtg.cloudworkstations.dev",
        "http://localhost:3000",
        "http://localhost:9002",
    ],
});
const Busboy = require("busboy");
const path = require("path");
const os = require("os");
const fs = require("fs");

// --- INICIALIZAÇÃO DO FIREBASE (APENAS UMA VEZ) ---
admin.initializeApp();

// =================================================================
// FUNÇÃO 1: UPLOAD DE IMAGENS
// =================================================================
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
      const mimeType = file.mimeType;
      const filepath = path.join(tmpdir, filename);
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
          res.status(400).json({success: false, error: "No file uploaded."});
          return;
        }

        const {filepath, mimeType} = fileData;
        const originalFilename = path.basename(filepath);
        const uniqueFilename = `${Date.now()}-${originalFilename}`;

        const bucket = admin.storage().bucket();
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
        res.status(500).json({success: false, error: "Failed to upload image."});
      }
    });

    // Use req.pipe(busboy) for robust stream handling
    req.pipe(busboy);
  });
});


// =================================================================
// FUNÇÃO 2: GERAR XML PARA O CHAVES NA MÃO
// =================================================================
exports.gerarXmlChavesNaMao = onSchedule({
  schedule: "every day 03:00",
  timeZone: "America/Sao_Paulo",
  region: "southamerica-east1",
}, async (event) => {
  logger.info("Iniciando a geração do XML para o Chaves na Mão.");

  try {
    const imoveisSnapshot = await admin.firestore().collection("imoveis").get();
    const imoveisParaXml = [];

    imoveisSnapshot.forEach((doc) => {
      const imovelData = doc.data();
      const imovelNode = {
        CodigoImovel: {_text: imovelData.codigo || ""},
        TipoImovel: {_text: imovelData.tipo || ""},
        Cidade: {_text: imovelData.cidade || ""},
        Bairro: {_text: imovelData.bairro || ""},
        ValorVenda: {_text: imovelData.valorVenda || 0},
        QtdDormitorios: {_text: imovelData.qtdDormitorios || 0},
        Descricao: {_cdata: imovelData.descricao || ""},
        Fotos: {
          Foto: imovelData.fotos ? imovelData.fotos.map((foto) => ({
            URL: {_text: foto.url},
            Principal: {_text: foto.principal || false},
          })) : [],
        },
      };
      imoveisParaXml.push(imovelNode);
    });

    const objetoFinalJs = {
      _declaration: {_attributes: {version: "1.0", encoding: "UTF-8"}},
      Carga: {
        DataHora: {_text: new Date().toISOString()},
        Imoveis: {
          Imovel: imoveisParaXml,
        },
      },
    };

    const xmlString = js2xml(objetoFinalJs, {compact: true, spaces: 4});

    const bucket = admin.storage().bucket();
    const file = bucket.file("integracoes/chavesnamao.xml");

    await file.save(xmlString, {
      metadata: {
        contentType: "application/xml",
      },
    });
    await file.makePublic();

    const publicUrl = file.publicUrl();
    logger.info("XML gerado com sucesso! Link público:", publicUrl);
  } catch (error) {
    logger.error("Erro ao gerar o XML:", error);
  }
});
