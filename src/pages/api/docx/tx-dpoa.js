const PizZip = require('pizzip');
const Docxtemplater = require('docxtemplater');
const requireAuth = require('../_require-auth');
const fs = require('fs');
const path = require('path');
const { uploadFromBuffer, listFiles } = require('../../../util/uploadToS3');
const { getSignedUrlForFile } = require('../../../util/s3BucketsFiles');
const { createAndUploadPdf } = require('../../../util/pdf');

const createDpoaFromTemplate = async (req, res) => {
  try {
    const dirRelativeToPublicFolder = 'docx-templates';

    // file name to use for saving to AWS, both .docx and .pdf
    const fileNameForSaving = 'Durable_Power_of_Attorney';

    const dir = path.resolve('./public', dirRelativeToPublicFolder);
    const userId = req.user.id;

    await listFiles();

    // Check for required fields
    const requiredFields = [
      'firstName',
      'lastName',
      'city',
      'county',
      'address',
      'state',
      'zip',
      'agents',
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

    const {
      firstName,
      middleName,
      suffix,
      lastName,
      address,
      city,
      county,
      state,
    } = req.body;
    const zipCode = req.body['zip'];
    const { agents } = req.body;

    // store values passed in variables
    const notaryCounty =
      req.body['notaryCounty'] && req.body['notaryCounty'].trim().length > 0
        ? req.body['notaryCounty'].toUpperCase()
        : '___________________';

    const stringFields = [
      'firstName',
      'lastName',
      'middleName',
      'address',
      'city',
      'county',
      'state',
      'zip',
    ];
    const nonStringField = stringFields.find(
      (field) => field in req.body && typeof req.body[field] !== 'string'
    );

    if (nonStringField) {
      return res.status(422).json({
        code: 422,
        reason: 'ValidationError',
        message: 'Incorrect field type: expected string',
        location: nonStringField,
      });
    }

    // Load the docx file as binary content
    //console.log('PATH', path.resolve(__dirname, '../../../../..'));
    // const content = fs.readFileSync(
    //   path.resolve(
    //     __dirname,
    //     '../../../../../src/docx-templates/TX_DPOA_Template.docx'
    //   ),
    //   'binary'
    const content = fs.readFileSync(
      path.resolve(dir, 'TX_DPOA_Template.docx'),
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

    const clientAddress = `${address}, ${city}, ${state} ${zipCode}`;
    const primaryAgent = agents[0];
    const dpoaPrimaryAgentName = primaryAgent.fullName;
    const dpoaPrimaryAgentAddress =
      primaryAgent.address.trim().length > 0
        ? primaryAgent.address
        : '______________________';

    const altAgents = agents.slice(1).map((a) => {
      return { fullName: a.fullName };
    });

    //console.log('ALT AGENTS', altAgents);

    const docVars = {
      clientName,
      clientAddress,
      notaryCounty,
      dpoaPrimaryAgentName,
      dpoaPrimaryAgentAddress,
      dpoaAgents: altAgents, // successor agents
    };

    // Render the document (Replace {first_name} by John, {last_name} by Doe, ...)
    doc.render(docVars);

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
    //     `../../../../../src/output-files/${userId}__tx-dpoa_output.docx`
    //   ),
    //   buf
    // );
    // fs.writeFileSync(
    //   path.resolve(dir, '..', 'docx-output', `${userId}__tx-dpoa_output.docx`),
    //   buf
    // );

    // Check if user already has a bucket titled with his/her id.
    // If not, create one
    // const folderExists = checkUserS3FolderExists(req.user.id);
    // if (!folderExists) {

    // }

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
    //console.log('SIGNED URL', signedUrl);
    if (!signedUrl) {
      throw new Error('No signed url was created');
    }

    // Create and upload PDF file to AWS
    const pdfUploadResult = await createAndUploadPdf(
      signedUrl,
      'Durable Power of Attorney',
      fileNameForSaving,
      userId
    );
    if (
      !pdfUploadResult ||
      pdfUploadResult['$metadata']['httpStatusCode'] !== 200
    ) {
      throw new Error(
        `Unable to create/upload PDF file for Durable Power of Attorney`
      );
    }

    // return success
    return res.status(201).json({
      code: 201,
      status: 'success',
      message: `File Created`,
    });
  } catch (err) {
    console.log('ERROR - DPOA', err.message);
    return res.status(500).json({
      code: 500,
      status: 'error',
      reason: err.message,
      message: 'Unable to create DPOA',
      location: '/api/docx/tx-dpoa',
    });
  }
};

export default requireAuth(createDpoaFromTemplate);
