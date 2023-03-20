const { convertDocxToPdf } = require('./api2Pdf');
const { uploadFromUrl } = require('./uploadToS3');

// Create PDF
const createAndUploadPdf = async (
  fileUrl,
  fileType,
  fileNameForSaving,
  userId
) => {
  try {
    const pdfResult = await convertDocxToPdf(fileUrl);
    console.log('PDF RESULT', pdfResult);
    if (pdfResult.Error || !pdfResult.Success) {
      throw new Error(`Unable to create PDF for ${fileType}`);
    }
    const pdfFileUrl = pdfResult.FileUrl;
    //.log('PDF FILE URL', pdfFileUrl);
    return await uploadFromUrl(
      pdfFileUrl,
      process.env.S3_BUCKET,
      `user-docs/${userId}/${fileNameForSaving}.pdf`
    );
  } catch (err) {
    console.log('ERROR IN createAndUploadPdf', err);
    return null;
  }
};

module.exports = { createAndUploadPdf };
