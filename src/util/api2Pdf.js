const Api2Pdf = require('api2pdf');

const convertDocxToPdf = async (fileUrl) => {
  const a2pClient = new Api2Pdf(process.env.APIPDF_API_KEY);
  return a2pClient
    .libreOfficeAnyToPdf(fileUrl)
    .then(function (result) {
      console.log(result);
      if (result.Error) {
        throw new Error(result.Error);
      }
      return result;
    })
    .catch((err) => {
      console.log('ERROR CONVERTING TO PDF', err);
      throw err;
    });
};

module.exports = { convertDocxToPdf };
