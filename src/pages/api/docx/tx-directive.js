const requireAuth = require('../_require-auth');
const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { uploadFromBuffer } = require('../../../util/uploadToS3');
const { getSignedUrlForFile } = require('../../../util/s3BucketsFiles');
const { createAndUploadPdf } = require('../../../util/pdf');

const handler = async (req, res) => {
  try {
    const userId = req.user.id;
    const fs = require('fs');
    const path = require('path');
    const fileNameForSaving = 'Directive_to_Physicians';
    //console.log(req.body);

    const dirRelativeToPublicFolder = 'docx-templates';
    const dir = path.resolve('./public', dirRelativeToPublicFolder);

    // Check for required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'middleName',
      'city',
      'county',
    ];
    const missingField = requiredFields.find((field) => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code: 422,
        status: 'error',
        reason: 'ValidationError',
        message: 'Missing field',
        location: missingField,
      });
    }

    // store values passed in variables
    const { firstName, middleName, lastName, city, county } = req.body;
    const notaryCounty =
      req.body['notaryCounty'] && req.body['notaryCounty'].trim().length > 0
        ? req.body['notaryCounty'].toUpperCase()
        : '___________________';

    const stringFields = ['firstName', 'lastName', 'city', 'county'];
    const nonStringField = stringFields.find(
      (field) => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        status: 'error',
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField,
      });
    }

    // Load the docx file as binary content
    //console.log('PATH', path.resolve(__dirname, '../../../../..'));
    // const content = fs.readFileSync(
    //   //path.resolve(__dirname, "../input.docx"),
    //   path.resolve(
    //     __dirname,
    //     '../../../../../src/docx-templates/TX_Directive_Template.docx'
    //   ),
    //   'binary'
    // );
    const content = fs.readFileSync(
      path.resolve(dir, 'TX_Directive_Template.docx'),
      'binary'
    );

    const zip = new PizZip(content);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    const clientName = `${firstName.trim()}${
      middleName ? ' ' + middleName.trim() : ''
    } ${lastName.trim()}`;

    const docVars = {
      clientName,
      city,
      county,
      notaryCounty,
    };

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(docVars);

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: 'DEFLATE',
    });

    // buf is a nodejs Buffer, you can either write it to a
    // file or res.send it with express for example.
    // fs.writeFileSync(
    //   path.resolve(
    //     __dirname,
    //     `../../../../../src/output-files/${userId}__directive_output.docx`
    //   ),
    //   buf
    // );

    // save to S3 Bucket rather than save to local file system (as commented out above)
    await uploadFromBuffer(
      buf,
      `user-docs/${userId}/${fileNameForSaving}.docx`
    );

    //Get the signed url to create PDF file
    const signedUrl = await getSignedUrlForFile(
      process.env.S3_BUCKET,
      `user-docs/${userId}/${fileNameForSaving}.docx`,
      90
    );
    console.log('SIGNED URL', signedUrl);
    if (!signedUrl) {
      throw new Error('No signed url was created');
    }

    // Create and upload PDF file to AWS
    const pdfUploadResult = await createAndUploadPdf(
      signedUrl,
      'Directive to Physicians',
      fileNameForSaving,
      userId
    );
    if (
      !pdfUploadResult ||
      pdfUploadResult['$metadata']['httpStatusCode'] !== 200
    ) {
      throw new Error(
        `Unable to create/upload PDF file for ${fileNameForSaving}`
      );
    }

    return res.status(201).json({
      code: 201,
      status: 'success',
      message: `File Created`,
    });
    //return res.send(buf);
    // return res.sendFile(
    //   path.resolve(
    //     __dirname,
    //     `../../../../../src/output-files/${userId}__directive_output.docx`
    //   )
    // );

    //return res.send(Object.values(req.context.models.messages));
  } catch (err) {
    console.log('ERROR - DIRECTIVE', err.message);
    return res.status(500).json({
      code: 500,
      status: 'error',
      reason: err.message,
      message: 'Unable to create directive',
      location: '/api/docx/tx-directive',
    });
  }
};

export default requireAuth(handler);
